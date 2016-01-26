/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform sampler2D textureImage;

in vertexData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
  //TODO Exercise 4:
}frag;

out vec4 outcolour;

///////////////

void main()
{
  //TODO: get texture information. e.g.,
  //vec4 outcol = texture(textureImage, frag.texCoords.xy);

  //////////////////////////////////////////////////////////
  //TODO Exercise 04a: integrate the texture information 
  //into a Phong shader (e.g. use the one from Exercise 2)
  //////////////////////////////////////////////////////////
  
  outcolour = vec4(1.0,0.0,0.0,0.0);
  //////////////////////////////////////////////////////////


}
