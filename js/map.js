        let map;

        function init() {
            //使用AJAX從網路上抓資料
            let req = new XMLHttpRequest();
            req.open("get", "https://opendata.epa.gov.tw/api/v1/OTH00539?%24skip=0&%24format=json");
            req.addEventListener("load", function () {
                // console.log(this.responseText); //第一時間從網路上取得字串型態的資料
                let data = JSON.parse(this.responseText); //詮釋成物件或陣列
                // console.log(data);
                initMap(data);
            });
            req.send();
        }

        let geocoder;


        function initMap(data) {
            map = new google.maps.Map(document.getElementById("map"), {
                center: {
                    lat: 23.75,
                    lng: 121
                },
                zoom: 8
            });

            geocoder = new google.maps.Geocoder();

            let select = document.querySelector("#selectDistrict");
            let districtArr = ["keelung", "newtaipei", "taipei", "yilan", "taoyuan", "hsinchucity", "hsinchu", "miaoli", "taichung", "changhua",
                "nantou", "yunlin", "chiayi", "tainan", "kaohsiung", "pingtung", "hualien", "taitung", "penghu", "kinmen"
            ]
            let keyArr = ["基隆市", "新北市", "臺北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣",
                "南投縣", "雲林縣", "嘉義縣", "臺南市", "高雄市", "屏東縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣"
            ]

            //將 keyArr 的資料塞進 option 文字裡、 districtArr 塞進 option 的 value 裡
            select.addEventListener("change", updateList);
            for (let i = 0; i < keyArr.length; i++) {
                const opt = document.createElement('option');
                opt.textContent = keyArr[i];
                opt.value = districtArr[i];
                selectDistrict.appendChild(opt);
            }

            //找出與 select 符合的
            function updateList() {
                let matchDristrict = districtArr.filter((item) => {
                    return item == select.value;
                })
                let indexNum = districtArr.indexOf(matchDristrict.toString());
                // console.log(matchDristrict);
                // console.log(indexNum);
                filterList(data, keyArr[indexNum]);
            }

            //用 include 把地區過濾掉
            function filterList(data, district) {
                let newList = data.filter(data => {
                    let item = data.Business_Address.includes(district);
                    if (item == true) {
                        return data;
                    }
                })
                console.log(newList);
                let listLength = newList.length;
                for (let i = 0; i < listLength; i++) {
                    showSite(newList[i]);
                }
            }
        }


        function showSite(site) {
            console.log(site);
            geocoder.geocode({
                address: site.Business_Address
            }, function (results, status) {
                console.log(results);
                let position = results[0].geometry.location;
                let marker = new google.maps.Marker({
                    position: position,
                    map: map
                });
                marker.addListener("click", function () {
                    // 在地圖上顯示資訊視窗: 使用google.maps.InfoWindow
                    let info = new google.maps.InfoWindow({
                        content: '<h2 style="font-weight: bold;">' + site.Company_Name + '</h2>' + site.Business_Address +
                            '</br><p>可回收物品：' + site.Sale_Item + '</p>'
                    });
                    info.open(map, marker);
                });
            });
        }