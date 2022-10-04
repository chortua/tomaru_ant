'use strict';

let scale = 0.3;

/* Pick up locations, if clicked, the cart will move the clicked location */
const pickup1 = document.getElementById("0-PickUp1");
pickup1.addEventListener('click', function onClick(event) {
    document.getElementById("cart").style.transform = "translateX(-179px) translateY(-310px) scale(scale)";
    document.getElementById("kara").innerHTML = "0-PickUp1"

})
const pickup2 = document.getElementById("0-PickUp2");
pickup2.addEventListener('click', function onClick(event) {
    document.getElementById("cart").style.transform = "translateX(29px) translateY(-310px) scale(scale)";
    document.getElementById("kara").innerHTML = "0-PickUp2"
})
const pickup3 = document.getElementById("0-PickUp3");
pickup3.addEventListener('click', function onClick(event) {
    document.getElementById("cart").style.transform = "translateX(220px) translateY(-310px) scale(scale)";
    console.log(event);
    document.getElementById("kara").innerHTML = "0-PickUp3"
})
/* if any drop station is clicked, it will send the informatio to create a ticket */
function reply_click(clicked_id) {
    document.getElementById("made").innerHTML = clicked_id;
    document.getElementById(clicked_id).style.backgroundColor = "red";
}

function create_mission() {
    const tocken = fetch("http://192.168.128.168:8081/wms/monitor/session/login?username=admin&pwd=123456")
        .then((response) => response.json())
        .then((data) => {
            return data;
            console.print(data);
        });


    const create_api_mission = () => {
        tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://192.168.128.168:8081/wms/rest/missions?&sessiontoken="
            url += key
            let from = document.getElementById("kara").innerHTML
            let to = document.getElementById("made").innerHTML
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    missionrequest: {
                        requestor: "Chris H",
                        missiontype: "7",
                        fromnode: from,
                        tonode: to,
                        cardinality: "1",
                        priority: 2,
                        parameters: {
                            value: { "payload": "Default payload" },
                            desc: "Mission extension",
                            type: "org.json.JSONObject",
                            name: "parameters"
                        }
                    }
                })/*JSON.stringify*/
            })
                .then(res => { return res.json() })
                .then(data => console.log(data))
        })

    }/* Create Mission API */
    create_api_mission();
}

function insert_avg() {
    const tocken = fetch("http://192.168.128.168:8081/wms/monitor/session/login?username=admin&pwd=123456")
        .then((response) => response.json())
        .then((data) => {
            return data;
        });


    const create_api_insertion = () => {
        tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://192.168.128.168:8081/wms/rest/vehicles/stoclin_tomaru/command?&sessiontoken="
            url += key
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    command: {
                        name: "insert",
                        args: {
                            nodeId: "00-Charger"
                        }
                    }
                })/*JSON.stringify*/
            })
                .then(res => { return res.json() })
                .then(data => console.log(data))

        })

    }/* Insert the vehicle */
    create_api_insertion();
    document.getElementById("stoclin").style.transform = "translateX(0px) translateY(0px) scale(0.5) rotate(0.5turn)";

}
function extract_avg() {
    const tocken = fetch("http://192.168.128.168:8081/wms/monitor/session/login?username=admin&pwd=123456")
        .then((response) => response.json())
        .then((data) => {
            return data;
        });

    const create_api_insertion = () => {
        tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://192.168.128.168:8081/wms/rest/vehicles/stoclin_tomaru/command?&sessiontoken="
            url += key
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    command: {
                        name: "extract",
                        args: {}
                    }
                })/*JSON.stringify*/
            })
                .then(res => { return res.json() })
                .then(data => console.log(data))
        })

    }/* Insert the vehicle */
    create_api_insertion();
    document.getElementById("stoclin").style.transform = "translateX(-457px) translateY(-300px) scale(0.5) rotate(0.25turn)";
}

function get_missions() {
    const tocken = fetch("http://192.168.128.168:8081/wms/monitor/session/login?username=admin&pwd=123456")
        .then((response) => response.json())
        .then((data) => {
            return data;
        });

    const create_api_insertion = () => {
        tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://192.168.128.168:8081/wms/rest/missions?&sessiontoken="
            url += key
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    command: {
                        name: "extract",
                        args: {}
                    }
                })/*JSON.stringify*/
            })
                .then(res => { return res.json() })
                .then(data => console.log(data))
        })

    }/* Insert the vehicle */
    create_api_insertion();

}