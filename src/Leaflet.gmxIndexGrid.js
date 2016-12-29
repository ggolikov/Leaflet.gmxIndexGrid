L.GmxIndexGrid = L.LayerGroup.extend({
    setGrid: function (grid) {
        this._grid = grid;
        return this;
    },

    setBounds: function (bounds) {
        this._bounds = bounds;
        return this;
    },

    clipGrid: function () {
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

        console.log(lats, lngs);
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
