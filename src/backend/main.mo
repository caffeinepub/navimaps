import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Float "mo:core/Float";

actor {

  // IC management canister for HTTP outcalls
  let ic = actor "aaaaa-aa" : actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      transform : ?{
        function : shared query ({ response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
        context : Blob;
      };
      is_replicated : ?Bool;
    }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
  };

  // Format a Float as a fixed-point decimal with 6 places for use in URLs
  func floatToUrlText(f : Float) : Text {
    f.format(#fix(6 : Nat8));
  };

  /// Proxy OSRM routing request.
  /// Returns raw JSON string from OSRM, or an error JSON string on failure.
  public func calculateRoute(fromLon : Float, fromLat : Float, toLon : Float, toLat : Float) : async Text {
    let url = "https://router.project-osrm.org/route/v1/driving/"
      # floatToUrlText(fromLon) # "," # floatToUrlText(fromLat)
      # ";" # floatToUrlText(toLon) # "," # floatToUrlText(toLat)
      # "?overview=full&geometries=geojson&steps=true";

    try {
      let response = await ic.http_request({
        url = url;
        max_response_bytes = ?500_000;
        method = #get;
        headers = [{ name = "Accept"; value = "application/json" }];
        body = null;
        transform = null;
        is_replicated = ?false;
      });

      switch (response.body.decodeUtf8()) {
        case (?text) { text };
        case null { "{\"error\":\"Kon het antwoord van de routeserver niet decoderen\"}" };
      };
    } catch (_) {
      "{\"error\":\"Routeberekening mislukt. Controleer uw verbinding en probeer opnieuw.\"}";
    };
  };

  /// Proxy Nominatim geocoding request.
  /// Returns raw JSON string from Nominatim, or an error JSON string on failure.
  public func geocodeAddress(searchQuery : Text) : async Text {
    // URL-encode the query by replacing spaces with + (simple encoding for common cases)
    let encodedQuery = searchQuery.replace(#char ' ', "+");

    let url = "https://nominatim.openstreetmap.org/search?q="
      # encodedQuery
      # "&format=json&limit=5&addressdetails=1";

    try {
      let response = await ic.http_request({
        url = url;
        max_response_bytes = ?200_000;
        method = #get;
        headers = [
          { name = "User-Agent"; value = "NaviMaps/1.0" },
          { name = "Accept"; value = "application/json" },
          { name = "Accept-Language"; value = "nl" },
        ];
        body = null;
        transform = null;
        is_replicated = ?false;
      });

      switch (response.body.decodeUtf8()) {
        case (?text) { text };
        case null { "{\"error\":\"Kon het antwoord van de geocodeerserver niet decoderen\"}" };
      };
    } catch (_) {
      "{\"error\":\"Adres zoeken mislukt. Controleer uw verbinding en probeer opnieuw.\"}";
    };
  };
};
