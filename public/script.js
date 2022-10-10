'use strict';

let scale_project = "0.3";
let move_project_x = 160; /* + left, - right */
let move_project_y = 80;/* + up, - down*/
let ip_address = "localhost"; /* ip of Server (localhost:)*/
let counter_mission = 0;
let clicked_kara = "";
let clicked_made = "";
let color_boolean = 1;
let key = "";
let url = "";
/* these are variable containing x and y */
let points_info = {
    coordinates: [
        /*Register new pickup or drop points here */
        { name: "0-A-Charger-HP", x: (0 + 6.9), y: (0 - 3.7), action: "none" },
        { name: "0-PickUp1", x: -3.571, y: 8.043, action: "pickup" },
        { name: "0-PickUp2", x: 5.8, y: 8.045, action: "pickup" },
        { name: "0-PickUp3", x: 15.992, y: 8.018, action: "pickup" },
        { name: "0-Drop1", x: -8, y: -5, action: "drop" },
        { name: "0-Drop2", x: -8, y: -6, action: "drop" },
        { name: "0-Drop3", x: -8, y: -7, action: "drop" },
        { name: "0-Drop4", x: -8, y: -8, action: "drop" },
        { name: "0-Drop5", x: -8, y: -9, action: "drop" },
        { name: "0-Drop6", x: -8, y: -10, action: "drop" },
        { name: "0-Cargo1", x: 1, y: -6, action: "pickupE" },
        { name: "0-Cargo2", x: 1, y: -8, action: "pickupE" },
        { name: "0-Cargo3", x: 1, y: -10, action: "pickupE" }
    ]
};

let info = points_info.coordinates;
create_points(info)

/* will locate rectangular boxes on each node (drop, pick up, chargers)*/
function create_points(info) {
    for (let i = 0, len = info.length; i < len; i++) {
        document.getElementById(info[i].name).style.transform = "translateX(" + (((info[i]['x'] * scale_project) * 100) - move_project_x) + "px)translateY(" + (((info[i]['y'] * scale_project) * -100) - move_project_y) + "px) scale(" + scale_project + ")";
    }
}

/* if any drop station is clicked, it will send the informatio to create a ticket (oct/06/2022)*/
function reply_click(clicked_id) {

    if (counter_mission === 0) {
        document.getElementById("kara").innerHTML = clicked_id;
        document.getElementById(clicked_id).style.backgroundColor = "red";
        clicked_kara = clicked_id;
        counter_mission += 1;

    }
    else if (counter_mission === 1) {
        document.getElementById("made").innerHTML = clicked_id;
        document.getElementById(clicked_id).style.backgroundColor = "yellow";
        clicked_made = clicked_id;
        counter_mission += 1;
    }
    else {
        counter_mission = 0;
        document.getElementById(clicked_kara).style.backgroundColor = "#d4dce4";
        document.getElementById("kara").innerHTML = "から"
        document.getElementById(clicked_made).style.backgroundColor = "#d4dce4";
        document.getElementById("made").innerHTML = "まで"

    }
}
var tomaru = new antApi();

function antApi() {

    this.tocken = fetch("http://" + ip_address + ":8081/wms/monitor/session/login?username=admin&pwd=123456")
        .then((response) => response.json())
        .then((data) => { return data; });

    this.tocken.then((a) => {
        let key = (a["payload"]["sessiontoken"])
        let url = "http://" + ip_address + ":8081/wms/rest/missions?&sessiontoken="
        url += key

    })

    this.create_mission = () => {
        this.tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://" + ip_address + ":8081/wms/rest/missions?&sessiontoken="
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
    this.insert_agv = () => {
        this.tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://" + ip_address + ":8081/wms/rest/vehicles/stoclin_tomaru/command?&sessiontoken="
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
                            nodeId: info[0].name
                        }
                    }
                })/*JSON.stringify*/
            })
                .then(res => { return res.json() })
                .then(data => console.log(data))

        })

    }/* Insert the vehicle */
    document.getElementById("stoclin").style.transform = "translateX(0px) translateY(0px) scale(" + scale_project + ") rotate(0.5turn)";

    this.extract_avg = () => {
        this.tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://" + ip_address + ":8081/wms/rest/vehicles/stoclin_tomaru/command?&sessiontoken="
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

    }/* extract the vehicle/ goes to the side of the screen*/


    async function getkey() {
        const response = await fetch("http://" + ip_address + ":8081/wms/monitor/session/login?username=admin&pwd=123456");
        const data = await response.json();

        let key_coordinates = data["payload"]["sessiontoken"];
        let url_coordinates = "http://" + ip_address + ":8081/wms/rest/vehicles/stoclin_tomaru/info?&sessiontoken="
        url_coordinates += key_coordinates;
        const get_coordinates = await fetch(url_coordinates)
        const data_coordinates = await get_coordinates.json()
        const xyz_coordinates = data_coordinates["payload"]["vehicles"][0]["location"]["coord"];
        let x_stoclin = xyz_coordinates[0];
        let y_stoclin = xyz_coordinates[1];
        let z_stoclin = data_coordinates["payload"]["vehicles"][0]["location"]["course"];


        document.getElementById("stoclin").style.transform = "translateX(" + ((((x_stoclin - 2) * scale_project) * 100) - move_project_x) + "px) translateY(" + ((((y_stoclin - 3) * scale_project) * -100) - move_project_x) + "px) scale(" + scale_project + ") rotate(" + z_stoclin * -0.1592356688 + "turn)";
        console.log(data_coordinates["payload"]["vehicles"][0]["location"]["course"], (z_stoclin * 0.1592356688));
    }
    setInterval(() => { getkey() }, 1000);

}

/*

return data["payload"]["vehicles"][0]["location"]["coord"]

ttp://localhost:8081/wms/rest/vehicles?&sessiontoken=ZQqRutoiN2ojgfFqZ%2F8tGkBVZ%2B74MvURTjaDtoxodYs%3D
    this.tocken = fetch("http://" + ip_address + ":8081/wms/monitor/session/login?username=admin&pwd=123456")
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
    this.create_mission = () => {
        this.tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://" + ip_address + ":8081/wms/rest/missions?&sessiontoken="
            url += key
            let from = document.getElementById("kara").innerHTML
            let to = document.getElementById("made").innerHTML
            fetch(url, {





*/