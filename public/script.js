'use strict';



/* Pick up locations, if clicked, the cart will move the clicked location */
const pickup1 = document.getElementById("0-PickUp1");
pickup1.addEventListener('click', function onClick(event) {
    document.getElementById("cart").style.transform = "translateX(-179px) translateY(-410px) scale(0.5)";
    document.getElementById("kara").innerHTML = "0-PickUp1"

})
const pickup2 = document.getElementById("0-PickUp2");
pickup2.addEventListener('click', function onClick(event) {
    document.getElementById("cart").style.transform = "translateX(29px) translateY(-410px) scale(0.5)";
    document.getElementById("kara").innerHTML = "0-PickUp2"
})
const pickup3 = document.getElementById("0-PickUp3");
pickup3.addEventListener('click', function onClick(event) {
    document.getElementById("cart").style.transform = "translateX(220px) translateY(-410px) scale(0.5)";
    console.log(event);
    document.getElementById("kara").innerHTML = "0-PickUp3"
})
/* if any drop station is clicked, it will send the informatio to create a ticket */
function reply_click(clicked_id) {
    document.getElementById("made").innerHTML = clicked_id;
    document.getElementById(clicked_id).style.backgroundColor = "red";
}

function create_mission() {
    const tocken = fetch("http://localhost:8081/wms/monitor/session/login?username=admin&pwd=123456")
        .then((response) => response.json())
        .then((data) => {
            return data;
        });


    const create_api_mission = () => {
        tocken.then((a) => {
            let key = (a["payload"]["sessiontoken"])
            let url = "http://localhost:8081/wms/rest/missions?&sessiontoken="
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
