/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

////////////////
//exercise 2
uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

out elemData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
}vertex;

/////////////

void main()
{
  vertex.pos = vec3(gl_ModelViewMatrix * gl_Vertex);
  vertex.normal = normalize(gl_NormalMatrix * gl_Normal);
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
  vertex.color = vec4(1.0,0.0,0.0,1.0);

  if(shader == 1)
  {   
    
    vec3 lightSource = gl_LightSource[0].position.xyz;
    // d is distance from light source to vertex
    float d = distance(lightSource, vertex.pos);
    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
      + gl_LightSource[0].linearAttenuation * d
      + gl_LightSource[0].quadraticAttenuation * d * d);
    
    // l is direction to light source from vertex 
    vec3 l = normalize(vec3(lightSource - vertex.pos));

    // e is direction from camera to vertex
    vec3 e = normalize(vertex.pos);
    vec3 r = reflect(l,vertex.normal);
    vec4 id = attenuation * diffuseColor * max(dot(vertex.normal,l),0);
    vec4 is = attenuation * specularColor * pow(max(dot(r,e),0), 0.3*specularExponent);
    vertex.color = ambientColor + id + is;

  }
}
