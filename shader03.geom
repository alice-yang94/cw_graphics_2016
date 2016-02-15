/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility
#extension GL_ARB_geometry_shader4 : enable

layout (max_vertices = 72) out;

const float pi = 3.14159265359;

////////////////
uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform int level;
uniform float time;

in vertexData
{
	vec3 pos;
	vec3 normal;
	vec4 color;
}vertices[];

out fragmentData
{
	vec3 vpos;
	vec3 normal;
	vec4 color;
}frag;   


///////////////////////////////////////////////////////
//pseudo random helper function
///////////////////////////////////////////////////////
float rnd(vec2 x)
{
	int n = int(x.x * 40.0 + x.y * 6400.0);
	n = (n << 13) ^ n;
	return 1.0 - float( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0;
}


///////////////////////////////////////////////////////
//TODO add code for exercise 3 Geometry generation here
///////////////////////////////////////////////////////
void produceVertex(float s, float t, vec4 v0, vec4 v01, vec4 v02, vec3 n0, vec3 n01, vec3 n02, int i)
{
  //r,s,t are barycentric coordinates of triangle composed of v0 v01 v02
  float r = 1 - s - t;
  //interpolating every property of this vertex
  frag.vpos = r * vertices[0].pos
            + s * vertices[1].pos
            + t * vertices[2].pos;
  frag.normal = r * n0
              + s * n01
              + t * n02;
  frag.color = r * vertices[0].color
             + s * vertices[1].color
             + t * vertices[2].color;
  gl_Position = r * v0
              + s * v01
              + t * v02;
              
  /*Animation
  gl_Position += frag.normal*(abs(rnd(frag.vpos.xy)))*time*0.01; 
  */
  EmitVertex();
}
///////////////////////////////
void main()
{
  float division_unit = 1/(pow(2, level));//unit barycentric coordinate for every subdivided triangle
  
  //current triangle is composed of 3 vertices, v0,v01,v02.
  vec4 v0 = gl_in[0].gl_Position;  //vector of vertex 0
  vec4 v01 = gl_in[1].gl_Position; //vector of vertex 1
  vec4 v02 = gl_in[2].gl_Position; //vector of vertex 2
  
  vec4 n0 = vertices[0].normal;  //normal of vertex 0 
  vec4 n01 = vertices[1].normal; //normal of vertex 1
  vec4 n02 = vertices[2].normal; //normal of vertex 2
  
  
  for (s = 0; s < 1; s += division_unit) {
      for (t = 0; t < 1 - s; t += division_unit) {
          //produce 3 vertices for each subdivided triangles
          produceVertex(s,t,v0,v01,v02,n0,n01,n02,division_unit);
          produceVertex(s+division_unit,t,v0,v01,v02,n0,n01,n02,division_unit);
          produceVertex(s,t+division_unit,v0,v01,v02,n0,n01,n02,division_unit);
          EndPrimitive();
      }
  }
	
}
