'use strict';

let scale_project = "0.31";
let move_project_x = 130; /* + left, - right */
let move_project_y = 68;/* + up, - down*/
let ip_address = "localhost" /*"192.168.1.71";  ip of Server (localhost:)*/
let counter_mission = 0;
let clicked_kara = "";
let clicked_made = "";
let color_boolean = 1;
let key = "";
let url = "";
let missions_data = []
/* these are variable containing x and y */
let points_info = {
    coordinates: [
        /*Register new pickup or drop points here */
        { name: "0-A-Charger-HP", x: (-2.9), y: (0 - 0.5), action: "none" },
        { name: "0-PickUp1", x: -2.551, y: 8.287, action: "pickup" },
        { name: "0-PickUp2", x: 3.086, y: 8.218, action: "pickup" },
        { name: "0-PickUp3", x: 13.063, y: 6.594, action: "pickup" },
        { name: "0-CargoDrop-1", x: 2.01, y: 2.239, action: "drop" },
        { name: "0-CargoDrop-2", x: 3.675, y: 2.239, action: "drop" },
        { name: "0-CargoDrop-3", x: 5.258, y: 2.239, action: "drop" },
        { name: "0-Drop1", x: -8.923, y: -4.925, action: "drop" },
        { name: "0-Drop2", x: -8.923, y: -6.111, action: "drop" },
        { name: "0-Drop3", x: -8.923, y: -7.299, action: "drop" },
        { name: "0-Drop4", x: -8.923, y: -8.485, action: "drop" },
        { name: "0-Drop5", x: -8.923, y: -9.672, action: "drop" },
        { name: "0-Drop6", x: -7.585, y: -4.925, action: "drop" },
        { name: "0-Drop7", x: -7.585, y: -6.111, action: "drop" },
        { name: "0-Drop8", x: -7.585, y: -7.304, action: "drop" },
        { name: "0-Drop9", x: -7.585, y: -8.481, action: "drop" },
        { name: "0-Drop_10", x: -7.585, y: -9.666, action: "drop" },

        { name: "0-CargoP-1", x: 0.262, y: -6.111, action: "pickupE" },
        { name: "0-CargoP-2", x: 0.262, y: -7.299, action: "pickupE" },
        { name: "0-CargoP-3", x: 0.262, y: -8.485, action: "pickupE" }
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


    this.insert_agv = () => {
        this.tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"]["-1"])
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


    async function track_stoclin() {
        /* This function call an api to get location of AGV. With the coordinates of AGV, the program will plot the AGV on screen */
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

        /* Get the coordinates, and positions the stoclin at intervals on the screen */
        document.getElementById("stoclin").style.transform = "translateX(" + ((((x_stoclin - 2) * scale_project) * 100) - move_project_x) + "px) translateY(" + ((((y_stoclin - 2.2) * scale_project) * -100) - move_project_x) + "px) scale(" + scale_project + ") rotate(" + z_stoclin * -0.1592356688 + "turn)";
        console.log(data_coordinates["payload"]["vehicles"][0]["location"]["course"], (z_stoclin * 0.1592356688));
        
    }
    setInterval(() => { track_stoclin() }, 10000);

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
                .then(data => track_missions(data["payload"]['acceptedmissions'][0]))
                

        })

    }/* Create Mission API */

    async function track_missions(mission_id) {
        /* This function will get informatiton on the missions,  */
        console.log(mission_id);
        const response = await fetch("http://" + ip_address + ":8081/wms/monitor/session/login?username=admin&pwd=123456");
        const data = await response.json();

        let key_coordinates = data["payload"]["sessiontoken"];
        let url_coordinates = "http://" + ip_address + ":8081/wms/rest/missions/" + mission_id + "?&sessiontoken="
        let url_filter = "&dataorderby%3D%5B%5B%22navigationstate%3A%22%2C%22asc%22%5D%5D%20"
        /* (%5B = [), (%2C = ,), (%22 = ""), (%5D = ])
        datarange=%5B0%2C6%5D&dataorderby=%5B%5B%22missionid%22%2C%22des%22%5D%5D
        dataselection%3D%7B%20%22criteria%22%3A%5B%22navigationstate%3A%3Aint%20IN%3A%201%7C3%22%5D%2C%22composition%22%3A%22OR%22%20%7D

        &datarange=%5B0%2C6%5D&dataorderby=%5B%5B%22missionid%22%2C%22asc%22%5D%5D
        */
        url_coordinates += key_coordinates;
        const get_missions = await fetch(url_coordinates)
        const data_missions = await get_missions.json()
        console.log(data_missions["payload"]["missions"])
        missions_data.push = data_missions["payload"]["missions"];
    

        return info

    }

    async function missions_info(){

        for( let i in missions_data)
        document.getElementById('mission_status').innerHTML = "<h1>" + missions_data[i] + "</h1>"
        

    }


}