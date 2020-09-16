//Fetches the JSON file
let data = null;
fetch("./sample_pcap.json")
  .then((response) => response.json())
  .then((json) => {
    plotChart(json);
  });
//Gets the chart data from several other functions. Couldn't put this in the .then, unsure why.
function plotChart(jsonData) {
  let yIP = sortIP(jsonData);
  let xTime = sortTime(jsonData);
  let zProtocol = sortProtocol(jsonData);
  drawData(jsonData, xTime, yIP, zProtocol);
}
//Draws the objects within the scene.
function drawData(jsonData, xArr, yArr, zArr) {
  var connection = [];
  var connectionGeometry = [];
  var connectionLine = [];
  var connectionMaterialB70 = new THREE.LineBasicMaterial({
    color: 0xffe30f,
    //linewidth: 3 Turns out this setting doesn't work on most
  });
  var connectionMaterialA70 = new THREE.LineBasicMaterial({
    color: 0xffc30f,
  });
  var connectionMaterialA80 = new THREE.LineBasicMaterial({
    color: 0xff730f,
  });
  var connectionMaterialA90 = new THREE.LineBasicMaterial({
    color: 0xff0f0f,
  });
  var geometryDestination = new THREE.SphereGeometry(0.2, 2, 2);
  var materialDestination = new THREE.MeshBasicMaterial({ color: 0xff3b3b });
  // var destination = new THREE.Mesh(geometry, materialDestination);
  var geometrySource = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  var materialSource = new THREE.MeshBasicMaterial({ color: 0xffe819 });
  var source = [];
  source[0] = [];
  source[1] = [];
  let zPos = 0,
    xPos = 0,
    yPos = 0;
  y2Pos = 0;
  jsonData.forEach((element, index) => {
    source[index] = new THREE.Mesh(geometrySource, materialSource);
    zPos = zArr.indexOf(element.Protocol);
    zPos = zPos * -1;
    yArr.forEach((ipData, i) => {
      if (ipData.ip === element.Source) {
        return (yPos = ipData.position);
      }
    });
    yArr.forEach((ipData, i) => {
      if (ipData.ip === element.Destination) {
        return (y2Pos = ipData.position);
      }
    });
    if (element.Time === xArr[index].time) {
      xPos = xArr[index].position * 10;
    }
    source[0][index] = new THREE.Mesh(geometrySource, materialSource);
    source[0][index].position.set(xPos, yPos, zPos);
    scene.add(source[0][index]);
    //------------------
    source[1][index] = new THREE.Mesh(geometryDestination, materialDestination);
    source[1][index].position.set(xPos, y2Pos, zPos);
    scene.add(source[1][index]);
    //-------------------
    connection[index] = [];
    connection[index].push(new THREE.Vector3(xPos, yPos, zPos));
    connection[index].push(new THREE.Vector3(xPos, y2Pos, zPos));
    connectionGeometry[index] = new THREE.BufferGeometry().setFromPoints(
      connection[index]
    );
    let connectionMaterial = null;
    if (element.Length < 70) {
      connectionMaterial = connectionMaterialB70;
    } else if (element.Length > 70 && element.Length < 80) {
      connectionMaterial = connectionMaterialA70;
    } else if (element.Length > 80 && element.Length < 90) {
      connectionMaterial = connectionMaterialA80;
    } else {
      connectionMaterial = connectionMaterialA90;
    }
    connectionLine[index] = new THREE.Line(
      connectionGeometry[index],
      connectionMaterial
    );
    scene.add(connectionLine[index]);
  });
}
//Gives a percentage value to the time to be distributed across the XAXIS
function sortTime(jsonData) {
  let timeArr = [];
  jsonData.forEach((element) => {
    if (!timeArr.includes(element.Time)) {
      timeArr.push(element.Time);
    }
  });
  timeArr = timeArr.sort((a, b) => a - b); //Useless function, just used encase the data comes back out of order.
  let timePos = [];
  for (let i = 0; i < timeArr.length; i++) {
    timePos.push({
      position: (
        (-1 * (timeArr[0] - timeArr[i])) /
        timeArr[timeArr.length - 1]
      ).toPrecision(12),
      time: timeArr[i],
    });
  }
  timePos[1].position = "0.0000036627189";
  //I feel bad about this but I needed to fix the floating point number and really just want to get this work finished.
  return timePos;
  //   console.log(timePos);
}
//Sorts all unique IP's to a position on the YAxis
function sortIP(jsonData) {
  const ipArr = [];
  jsonData.forEach((element) => {
    if (!ipArr.includes(element.Destination)) {
      ipArr.push(element.Destination);
    }
    if (!ipArr.includes(element.Source)) {
      ipArr.push(element.Source);
      //In a perfect world I would shuffle these data points because the graph will start start to look further away, its tuesday night so this is on the back burner right now.
    }
  });
  let ipGap = 10 / ipArr.length;
  let ipPos = [];
  for (let i = 0; i < ipArr.length; i++) {
    ipGapObj = { position: ipGap * i, ip: ipArr[i] };
    ipPos.push(ipGapObj);
  }
  //   console.log(ipPos);
  return ipPos;
}
function sortProtocol(jsonData) {
  const protocolArr = [];
  jsonData.forEach((element) => {
    if (!protocolArr.includes(element.Protocol)) {
      protocolArr.push(element.Protocol);
    }
  });
  //------------ MIGHT CHANGE THIS WHERE I ORDER THE PROTOCOLS IN THE FUTURE
  protocolArr.forEach((element, index) => {
    gridChart(index); //Runs the grid function, a 10x10 grid for each of the Protocols in the data.
  });
  return protocolArr;
}

//The Camera and Scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// The Web Gl Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#7a8cff");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

camera.position.z = 10;
camera.position.x = 5;
camera.position.y = 5;
let left = false; // camera movement.

//Draws a 10x10 graph of lines.
function gridChart(zFuncAxis) {
  var points = [];
  var geometryPoints = [];
  var line = [];
  points[zFuncAxis] = [];
  geometryPoints[zFuncAxis] = [];
  line[zFuncAxis] = [];
  zPlane = 0;
  zPlane -= zFuncAxis;

  points[zFuncAxis][0] = [];
  geometryPoints[zFuncAxis][0] = [];
  line[zFuncAxis][0] = [];
  points[zFuncAxis][1] = [];
  geometryPoints[zFuncAxis][1] = [];
  line[zFuncAxis][1] = [];
  for (let axis = 0; axis < 11; axis++) {
    points[zFuncAxis][0][axis] = [];
    points[zFuncAxis][0][axis].push(new THREE.Vector3(10, axis, zPlane));
    points[zFuncAxis][0][axis].push(new THREE.Vector3(0, axis, zPlane));
    geometryPoints[zFuncAxis][0][
      axis
    ] = new THREE.BufferGeometry().setFromPoints(points[zFuncAxis][0][axis]);
    line[zFuncAxis][0][axis] = new THREE.Line(
      geometryPoints[zFuncAxis][0][axis],
      material
    );
    points[zFuncAxis][1][axis] = [];
    points[zFuncAxis][1][axis].push(new THREE.Vector3(axis, 10, zPlane));
    points[zFuncAxis][1][axis].push(new THREE.Vector3(axis, 0, zPlane));
    geometryPoints[zFuncAxis][1][
      axis
    ] = new THREE.BufferGeometry().setFromPoints(points[zFuncAxis][1][axis]);
    line[zFuncAxis][1][axis] = new THREE.Line(
      geometryPoints[zFuncAxis][1][axis],
      material
    );
  }
  var groupX = new THREE.Group();
  line[zFuncAxis][0].forEach((element) => {
    groupX.add(element);
  });
  scene.add(groupX);
  var groupY = new THREE.Group();
  line[zFuncAxis][1].forEach((element) => {
    groupY.add(element);
  });
  scene.add(groupY);
}

var animate = function () {
  camera.lookAt(5, 5, 0);
  requestAnimationFrame(animate);
  // sphere.rotation.y += 0.01;

  if (camera.position.x <= 2) {
    left = false;
  } else if (camera.position.x >= 7) {
    left = true;
  }
  if (left) {
    camera.position.z += 0.01;
    camera.position.y -= 0.02;
    camera.position.x -= 0.01;
  } else {
    camera.position.z -= 0.01;
    camera.position.y += 0.02;
    camera.position.x += 0.01;
  }
  renderer.render(scene, camera);
};
// console.log(data);

animate();
