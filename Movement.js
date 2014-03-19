#pragma strict
var state = 0;
var left = -0.002;
var right = 0.002;
var direction = left;
var target : GameObject;
var cel : GameObject;

var lImage : Transform;
var rImage : Transform;

var Retina : Array;
var Gangalions : Array;

//texture


//isStatic()
var persistence : Vector3;

var parents = new Array("l_Retina","r_Retina");

var scale = new Array(Vector3(1,1,1),Vector3(1,0.5,0.5));

var coordinates = new Array(//left eye
							Vector3(0,0.25,-0.25),Vector3(0,0.25,0.25),Vector3(0,0.75,0.25),Vector3(0,0.75,-0.25), //type 0
							Vector3(0,-0.25,-0.25),Vector3(0,-0.25,0.25),Vector3(0,-0.75,-0.25),Vector3(0,-0.75,0.25), //type 0
							Vector3(0,1.5,0.5),Vector3(0,-1.5,0.5), //type 1
							//right eye
							Vector3(0,0.25,0.25),Vector3(0,0.25,-0.25),Vector3(0,0.75,0.25),Vector3(0,0.75,-0.25), //type 0
							Vector3(0,-0.25,0.25),Vector3(0,-0.25,-0.25),Vector3(0,-0.75,-0.25),Vector3(0,-0.75,0.25), //type 0
							Vector3(0,1.5,-0.5),Vector3(0,-1.5,-0.5)); //type 1


//a photoreceptor cell on the retina
public class Cell{
	public var name : String;
	public var body : GameObject;  
	//public var p : Vector3;  //position
	public var c : Color;   //color
	public var tag : String;
	public var parent_ : Transform;
	public var type : int;
	public var active : int;
	
	public function init (locp : Vector3, s : Vector3, pa : String){
		active = 0;
		parent_ = GameObject.Find(pa).transform;
		body = GameObject.CreatePrimitive(PrimitiveType.Cube);
		body.transform.parent = parent_;
		body.transform.localPosition = locp;
		body.transform.localScale = s;
		body.renderer.material.color = Color32(255,0,0,10);
		body.transform.tag = "Cell";
		//p = body.transform.position;
		tag = body.transform.tag;
	}
}

public class Gangalion{
	public var center : Cell;
	public var neighbour : Array;
	public var active : int;
}


//if the photoreceptor cell is active
function sensor (g : Cell){
	var event = 0;  //label of activity
	if (g.body.transform.parent == GameObject.Find("l_Retina").transform){
		lImage = GameObject.Find("LeftImage").transform;
		for(var t : Transform in lImage){
			var ldist = (g.body.transform.position.y-t.position.y)*(g.body.transform.position.y-t.position.y) 
			+ (g.body.transform.position.z-t.position.z)*(g.body.transform.position.z-t.position.z);
			if ((ldist<=0.000625 && g.type == 1)||(ldist<=0.00015625 && g.type == 0)){
				g.body.renderer.material.color = Color32(0,255,0,10);
				g.active = 1;
				event = 1;
				break;
			}	
		}
	}
	if (g.body.transform.parent == GameObject.Find("r_Retina").transform){
		rImage = GameObject.Find("RightImage").transform;
		for(var t : Transform in rImage){
			var rdist = (g.body.transform.position.y-t.position.y)*(g.body.transform.position.y-t.position.y) 
			+ (g.body.transform.position.z-t.position.z)*(g.body.transform.position.z-t.position.z);
			if ((rdist<=0.000625 && g.type == 1)||(rdist<=0.00015625 && g.type == 0)){
				g.body.renderer.material.color = Color32(0,255,0,10);
				g.active = 1;
				event = 1;
				break;
			}
		}
	}
	// reset to inactive
	if(event == 0){
		g.body.renderer.material.color = Color32(255,0,0,10);
		g.active = 0;
	}
}


function Start () {
	Retina = new Array();
	Gangalions = new Array();
	//build the left eye
	for (var i = 0;i<10;i++){
		if(i%4==0){
			var gangl = new Gangalion();
			gangl.neighbour = new Array();
			gangl.active = 0;
		} 
		var ncl = new Cell();
		ncl.init(coordinates[i],scale[0],parents[0]);
		if (Mathf.Abs(ncl.body.transform.localPosition.y)>=1){
			ncl.type = 1;
		}
		else{
			ncl.type = 0;
			ncl.body.transform.localScale = scale[1];
			if(i%4==0){gangl.center = ncl;}else{gangl.neighbour.Push(ncl);}
			if(i%4==3){Gangalions.Push(gangl);}
		}
		Retina.Push(ncl);
	}
	//build the right eye
	for (var j = 0;j<10;j++){
		if(j%4==0){
			var gangr = new Gangalion();
			gangr.neighbour = new Array();
			gangr.active = 0;
		} 
		var ncr = new Cell();
		ncr.init(coordinates[j+10],scale[0],parents[1]);
		if (Mathf.Abs(ncr.body.transform.localPosition.y)>=1){
			ncr.type = 1;
		}
		else{
			ncr.type = 0;
			ncr.body.transform.localScale = scale[1];
			if(j%4==0){gangr.center = ncr;}else{gangr.neighbour.Push(ncr);}
			if(j%4==3){Gangalions.Push(gangr);}
		}
		Retina.Push(ncr);
	}
}

var intent = new Cell();

function spontaneous(){
	//adjust width
	var width = GameObject.Find("r_Retina").transform.position.z - GameObject.Find("l_Retina").transform.position.z - 0.6;
	//Debug.Log(width);
	GameObject.Find("r_Retina").transform.position.z -= 0.5*width;
	GameObject.Find("l_Retina").transform.position.z += 0.5*width;
	//reset from a work state 
	GameObject.Find("l_Center").transform.position.z = -0.3;
	GameObject.Find("r_Center").transform.position.z = 0.3;
	
	var pos = GameObject.Find("Retina").transform.position;
	if(Vector3(0.725-pos.x,pos.y,pos.z).sqrMagnitude>=0.00001){
		GameObject.Find("Retina").transform.Translate((0.725-pos.x),pos.y*(-0.01),pos.z*(-0.01));
	}
	
	
	//reset rotation
	
	//
		
	if(GameObject.Find("l_Retina").transform.position.z<-0.75 || GameObject.Find("r_Retina").transform.position.z<-0.05){
		direction = right;
	}
	if(GameObject.Find("l_Retina").transform.position.z>0.05 || GameObject.Find("r_Retina").transform.position.z>0.75){
		direction = left;
	}
	GameObject.Find("l_Retina").transform.position.z += direction;
	GameObject.Find("r_Retina").transform.position.z += direction;
}

function saccade(){
	var dis_y = intent.body.transform.position.y-intent.parent_.position.y;
	var dis_z = intent.body.transform.position.z-intent.parent_.position.z;
	//Debug.Log(dis_y.ToString()+","+dis_z.ToString());
	GameObject.Find("Retina").transform.position.y += 0.1*dis_y;
	GameObject.Find("Retina").transform.position.z += 0.1*dis_z;
}


function tracking(){
	
	//adjust width
	var width = GameObject.Find("r_Retina").transform.position.z - GameObject.Find("l_Retina").transform.position.z - 0.6;
	//Debug.Log(width);
	GameObject.Find("r_Retina").transform.position.z -= 0.5*width;
	GameObject.Find("l_Retina").transform.position.z += 0.5*width;
	
	//gangalion cells status
	for(var g : Gangalion in Gangalions){
		if(g.active == 1){
			var dis_y = 0.0;
			var dis_z = 0.0;
			for(var c : Cell in g.neighbour){
				if(c.active == 1){
					dis_y += c.body.transform.position.y-g.center.body.transform.position.y;
					dis_z += c.body.transform.position.z-g.center.body.transform.position.z;
					//Debug.Log();
				}
			}
			//Debug.Log(dis_z);
			//normalize
			if(dis_y!=0 || dis_z!=0){
				dis_y = dis_y/(40*Mathf.Sqrt(dis_y*dis_y+dis_z*dis_z));
				dis_z = dis_z/(40*Mathf.Sqrt(dis_y*dis_y+dis_z*dis_z));
			}
			//Debug.Log(dis_z);
		}
	}
	GameObject.Find("Retina").transform.position.y += 0.5*dis_y;
	GameObject.Find("Retina").transform.position.z += 0.5*dis_z;
	
}

var moving = -1; //-1:unknown, 0:not moving, 1:moving.

function isStatic(){
	var current = GameObject.Find("Retina").transform.position;
	var offset = Mathf.Sqrt((current.y-persistence.y)*(current.y-persistence.y)+(current.z-persistence.z)*(current.z-persistence.z));
	if (offset<=0.0125){
		moving = 0;
		Debug.Log("not moving");
	}else{
		moving = 1;
		Debug.Log("moving");
	}
	
}

var positions : Array;
positions = new Array();

function scanning(){
	
	for(var g : Cell in Retina){
		if(g.type == 0 && g.active == 1){
			positions.Push(g.body.transform.position);
		}
	}
	var l_oscillation : Vector2 = Random.insideUnitCircle*0.025;
	GameObject.Find("l_Retina").transform.position.y = GameObject.Find("l_Center").transform.position.y + l_oscillation.x;
	GameObject.Find("l_Retina").transform.position.z = GameObject.Find("l_Center").transform.position.z + l_oscillation.y;
	var r_oscillation : Vector2 = Random.insideUnitCircle*0.025;
	GameObject.Find("r_Retina").transform.position.y = GameObject.Find("r_Center").transform.position.y + r_oscillation.x;
	GameObject.Find("r_Retina").transform.position.z = GameObject.Find("r_Center").transform.position.z + r_oscillation.y;
}

function showResult(){
	for(var v : Vector3 in positions){
		var showPixel = Instantiate(cel,Vector3(-3,-v.y*10,-v.z*10),Quaternion.identity);
		showPixel.transform.parent = GameObject.Find("Result").transform;
		showPixel.renderer.material.color.a = 0.2;
		showPixel.tag = "Result";
	}
}


function Updata_state(){
	state = 0;
	for (var g : Cell in Retina){
		if (g.type == 1 && g.active == 1){
			intent = g;
			state = 1;
			break;
		}
	}
	// saccade suppresses tracking
	if(state != 1){
		for (var g : Cell in Retina){
			if(g.type == 0 && g.active == 1){
				for(var gg : Gangalion in Gangalions){
					gg.active = 0;
					for(var c : Cell in gg.neighbour){
						if(gg.center.active == 0 && c.active == 1){
							gg.active = 1;
							//Debug.Log("gangalion active");
						}
					}
				}
				state = 2;
				break;
			}
		}
		if(state==2 && moving == 0){
			state = 3;
			GameObject.Find("l_Center").transform.position.z = GameObject.Find("l_Retina").transform.position.z;
			GameObject.Find("r_Center").transform.position.z = GameObject.Find("r_Retina").transform.position.z;
		}
	}

}

var timer = 10;

function Update () {
	
	for(var c : Cell in Retina){
		sensor(c);
	}
	
	if(timer==10){		
		persistence = GameObject.Find("Retina").transform.position;
	}
	if(state==0){
		spontaneous();
		moving = -1;
		//Debug.Log("spontaneous");
	}
	
	//scanning would last for a while
	if(state!=3){
		Updata_state();
	}
	
	if(state==1){
		saccade();
		moving = -1;
		//Debug.Log("saccade");
		timer -= 1;
		if(timer == 0)
			timer = 10;
	}
	if(state==2){
		tracking();
		//Debug.Log(timer);
		timer -= 1;
		if(timer == 0){
			isStatic();
			timer = 10;
		}
	}
	if(state==3){
		scanning();
		//Debug.Log("scanning");
		timer -= 1;
		if(timer == -90){
			//Debug.Log(positions.length);
			showResult();
			positions = new Array();
			timer = 10;
			state = 2;
		}
	}
	//Debug.Log(GameObject.Find("Retina").transform.position.y);
}
