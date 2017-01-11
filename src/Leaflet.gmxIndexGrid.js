L.GmxIndexGrid = L.LayerGroup.extend({
    setGrid: function (grid) {
        this._grid = grid;
        return this;
    },

    setBounds: function (bounds) {
        this._bounds = bounds;
        return this;
    },

    _getIndexLatLngs: function () {
        var coordsObj = this._getClippedCoordinates(),
            latLngsObj = this._getClippedLatLngs(coordsObj);

        var leftLatLngs = latLngsObj.leftLatLngs,
            topLatLngs = latLngsObj.topLatLngs;

        for (var i = 0; i < leftLatLngs.length; i++) {
            L.marker(leftLatLngs[i]).addTo(map);
        }
        for (var i = 0; i < topLatLngs.length; i++) {
            L.marker(topLatLngs[i]).addTo(map);
        }
        console.log(latLngsObj);
    },

    _getEdgeCoordinates: function () {
        if (!this._bounds || !this._grid || !this._grid.getLatLngs().length) {
            return;
        }

        var gridLatLngs = this._grid.getLatLngs(),
            len = gridLatLngs.length,
            sw = this._bounds.getSouthWest(),
            ne = this._bounds.getNorthEast(),
            latFit, lngFit,
            lats = [],
            lngs = [],
            ll;

        lats.push(sw.lat);
        lngs.push(sw.lng);

        for (var i = 0; i < len; i++) {
            ll = gridLatLngs[i],
            latFit = ll.lat > sw.lat && ll.lat < ne.lat,
            lngFit = ll.lng > sw.lng && ll.lng < ne.lng;

            if (latFit && !this._checkDublicates(ll.lat, lats)) {
                lats.push(ll.lat);
            }

            if (lngFit && !this._checkDublicates(ll.lng, lngs)) {
                lngs.push(ll.lng);
            }
        }

        lats.push(ne.lat);
        lngs.push(ne.lng);

        return {
            lats: lats,
            lngs: lngs
        }
    },

    _getEdgeLatLngs: function (coordsObj) {
        var lats = coordsObj.lats,
            lngs = coordsObj.lngs,
            topLatLngs = [],
            leftLatLngs = [],
            ll, lat, lng;

        // count leftLatLngs:
        lng = lngs[0];
        for (var i = 0; i < lats.length; i++) {
            ll = L.latLng([lats[i], lng]);
            leftLatLngs.push(ll);
        }

        // count topLatLngs:
        lat = lats[lats.length-1];
        for (var j = 0; j < lngs.length; j++) {
            ll = L.latLng([lat, lngs[j]]);
            leftLatLngs.push(ll);
        }

        return {
            leftLatLngs: leftLatLngs,
            topLatLngs: topLatLngs
        }
    },

    _checkDublicates: function (value, array) {
        var res = false;

        if (!array.length) {
            return res;
        }

        for (var i = 0; i < array.length; i++) {
            if (value === array[i]) {
                res = true;
                break;
            }
        }

        return res;
    }
});

L.gmxIndexGrid = function (grid) {
    return new L.GmxIndexGrid (grid);
};
