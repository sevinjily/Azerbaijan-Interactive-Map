// 1. Xəritəni yaradırıq və mərkəzi təyin edirik
        // Koordinatlar: [Enlik, Uzunluq] - Azərbaycan mərkəzi
        var map = L.map('map').setView([40.5, 48.5], 7);

        // 2. OpenStreetMap layını əlavə edirik
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // 3. Nümunə GeoJSON Məlumatları (Real layihədə bu hissə fayldan yüklənir)
        // Burada bir neçə bölgə üçün təxmini poliqonlar yaradılıb
        var sampleData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {"name": "Bakı", "population": 2300000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [49.6, 40.5], [50.1, 40.5], [50.2, 40.2], [49.7, 40.1], [49.6, 40.5]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Gəncə", "population": 335000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [46.3, 40.7], [46.45, 40.7], [46.45, 40.6], [46.3, 40.6], [46.3, 40.7]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Sumqayıt", "population": 345000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [49.5, 40.65], [49.7, 40.65], [49.7, 40.55], [49.5, 40.55], [49.5, 40.65]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Lənkəran", "population": 230000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [48.7, 38.9], [48.9, 38.9], [48.9, 38.7], [48.7, 38.7], [48.7, 38.9]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Şəki", "population": 188000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [47.0, 41.3], [47.3, 41.3], [47.3, 41.1], [47.0, 41.1], [47.0, 41.3]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Quba", "population": 170000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [48.4, 41.4], [48.6, 41.4], [48.6, 41.2], [48.4, 41.2], [48.4, 41.4]
                ]]
            }
        },

        /* --- Şəki ölçülü poliqonlar --- */

        {
            "type": "Feature",
            "properties": {"name": "Naxçıvan", "population": 460000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [45.26, 39.32], [45.56, 39.32], [45.56, 39.12], [45.26, 39.12], [45.26, 39.32]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Mingəçevir", "population": 104000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [46.90, 40.86], [47.20, 40.86], [47.20, 40.66], [46.90, 40.66], [46.90, 40.86]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "Xankəndi", "population": 55000},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [46.60, 39.92], [46.90, 39.92], [46.90, 39.72], [46.60, 39.72], [46.60, 39.92]
                ]]
            }
        }
    ]
};


        // 4. Rəng şkalası funksiyası (Əhali sayına görə)
        function getColor(d) {
            return d > 1000000 ? '#800026' : // Çox yüksək (Tünd qırmızı)
                   d > 500000  ? '#BD0026' :
                   d > 300000  ? '#E31A1C' :
                   d > 200000  ? '#FC4E2A' :
                   d > 100000  ? '#FD8D3C' : // Orta
                   d > 50000   ? '#FEB24C' :
                   d > 20000   ? '#FED976' :
                                 '#FFEDA0';  // Aşağı (Açıq sarı)
        }

        // 5. Stil funksiyası
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.population),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        // 6. İnteraktivlik (Hover effektləri)
        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            layer.bringToFront();
            info.update(layer.feature.properties);
        }

        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
            // Popup əlavə etmək
            layer.bindPopup("<h3>" + feature.properties.name + "</h3><p>Əhali: " + feature.properties.population.toLocaleString() + " nəfər</p>");
        }

        // 7. GeoJSON layını xəritəyə əlavə edirik
        var geojson = L.geoJson(sampleData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);


        // 8. İnfo Paneli (Sağ Yuxarı)
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '<h4>Bölgə Məlumatları</h4>' +  (props ?
                '<b>' + props.name + '</b><br />' + props.population.toLocaleString() + ' nəfər'
                : 'Məlumat üçün bölgənin üzərinə gəlin');
        };

        info.addTo(map);


        // 9. Leqenda (Sağ Aşağı)
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 20000, 50000, 100000, 200000, 300000, 500000, 1000000],
                labels = [];

            div.innerHTML += '<h4>Əhali Sayı</h4>';

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);