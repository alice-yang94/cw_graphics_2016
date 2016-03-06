/************************************************************************/
/*    Graphics 317 coursework exercise 05                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/


#version 150 compatibility

in vec3 origin, dir, point; 
out vec4 outcolour;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

const int raytraceDepth = 42;
const int numSpheres = 6;
const vec3 light_position = vec3(2,3,4);

const float CONSTANT_ATTENUTAION = 0.5;
const float LINEAR_ATTENUTAION = 0.4;
const float QUADRATIC_ATTENUATION = 0.3;
const int LIGHT_INTENSITY = 10;
const int SPECULAR_EXPONENT = 25;
const float epsilon = 0.00001;
const float reflectivity = 0.4;
const float ambient_factor = 0.2;

struct Ray
{
  vec3 origin;
  vec3 dir;
};
struct Sphere
{
  vec3 centre;
  float radius;
  vec3 colour;
};
struct Plane
{
  vec3 point;
  vec3 normal;
  vec3 colour;
};

struct Intersection
{
  float t;
  vec3 point;     // hit point
  vec3 normal;     // normal
  int hit;
  vec3 colour;
};

////////////////////////////////////////////////////////////////////
// TODO Exercise 5: implement a simple geometry based ray tracing
// implement the functions in the follwing. 
// In order to reach all points you need to implement at least one
// feature more than shown in the coursework description
// effects like refraction, scattering, caustics, soft hadows, etc. 
// are possible. 
////////////////////////////////////////////////////////////////////

void shpere_intersect(Sphere sph, Ray ray, inout Intersection intersect)
{
  vec3 p0 = ray.origin;
  vec3 ps = sph.centre;
  vec3 dp = p0 - ps;

  vec3 d = ray.dir;

  vec3 r = sph.radius;

  float quad_eq = pow(dot(d,dp),2) - pow(dp,2) + pow(r,2);

  //quad_eq > 0 means there are two solutions, intersection exists
  if (quad_eq > 0) {
    float base = -dot(d,dp); 
    float enter_factor = max(base - sqrt(quad_eq), 0);

    if (enter_factor > 0 && (enter_factor < intersect.t || intersect.hit == 0)) {
      
      intersect.t = enter_factor;
      intersect.point = p0 + (enter_factor * d);
      intersect.normal = normalize(intersect.point - ps);
      intersect.hit = 1;
      intersect.colour = sph.colour;
    }
  }

   
}

void plane_intersect(Plane pl, Ray ray, inout Intersection intersect)
{
  vec3 p0 = ray.origin;
  vec3 p1 = pl.point;
  vec3 n = pl.normal;
  vec3 d = ray.dir;

  float bottom = dot(d,n);

  if (bottom != 0) {

    float intersect_factor = - dot(p0 - p1, n) / dot(d,n);

    if (intersect_factor > 0 && (intersect_factor < intersect.t || intersect.hit == 0)) {
      intersect.t = intersect_factor;
      intersect.point = p0 + (intersect_factor * d);
      intersect.normal = n;
      intersect.hit = 1;
 
      intersect.colour = pl.colour;
      if (mod(floor(intersect.point.x), 2) == mod(floor(intersect.point.z), 2)) {
        intersect.colour = vec3(0.5, 0.5, 0.5) 
      }
      
    }

  }

}

Sphere sphere[numSpheres];
Plane plane;

//iterate through all spheres and plane to find intersections
void Intersect(Ray r, inout Intersection i)
{
  i.hit = 0;
 
  for (int k; k < numSpheres; k++) {
    sphere_intersect(sphere[k], r, i);
  }
  
  plane_intersect(plane, r, i);
  
  return i;
}

int seed = 0;
float rnd()
{
  seed = int(mod(float(seed)*1364.0+626.0, 509.0));
  return float(seed)/509.0;
}



vec3 computeShadow(in Intersection intersect)
{
  float epsilon = 0.00001;
  Intersection i;
  i.hit = 0;
  Ray shadow;
  shadow.origin = intersect.point + epsilon * intersect.normal;
  shadow.dir = normalize(light_position - shadow.origin);
  Intersect(shadow, i);
  
  if (i.hit == 0) {
    float d = distance(light_position - shadow.origin);
    float attenuation = 1.0 / ( CONSTANT_ATTENUTAION
      				+ LINEAR_ATTENUTAION * d
      				+ QUADRATIC_ATTENUATION * d * d);

    vec3 diffuseColour = intersect.colour;
    vec3 i_d = LIGHT_INTENSITY * attenuation * diffuseColour * dot(intersect.normal, shadow.dir);

    vec3 specularColour = intersect.colour;
    

    vec3 r = reflect(shadow.dir, intersect.normal);
    vec3 e = normalize(main_ray.dir);

    vec3 i_s = LIGHT_INTENSITY * attenuation * specularColour 
			* pow(max(dot(r,e),0), SPECULAR_EXPONENT);
    return i_d + i_s;
  }

  return vec3(0,0,0);
}

Ray main_ray;

void main()
{
  //initial scene definition
  sphere[0].centre   = vec3(-2.0, 1.5, -3.5);
  sphere[0].radius   = 1.5;
  sphere[0].colour = vec3(0.8,0.8,0.8);
  sphere[1].centre   = vec3(-0.5, 0.0, -2.0);
  sphere[1].radius   = 0.6;
  sphere[1].colour = vec3(0.3,0.8,0.3);
  sphere[2].centre   = vec3(1.0, 0.7, -2.2);
  sphere[2].radius   = 0.8;
  sphere[2].colour = vec3(0.3,0.8,0.8);
  sphere[3].centre   = vec3(0.7, -0.3, -1.2);
  sphere[3].radius   = 0.2;
  sphere[3].colour = vec3(0.8,0.8,0.3);
  sphere[4].centre   = vec3(-0.7, -0.3, -1.2);
  sphere[4].radius   = 0.2;
  sphere[4].colour = vec3(0.8,0.3,0.3);
  sphere[5].centre   = vec3(0.2, -0.2, -1.2);
  sphere[5].radius   = 0.3;
  sphere[5].colour = vec3(0.8,0.3,0.8);
  plane.point = vec3(0,-0.5, 0);
  plane.normal = vec3(0, 1.0, 0);
  plane.colour = vec3(1, 1, 1);
  seed = int(mod(dir.x * dir.y * 39786038.0, 65536.0));
  //scene definition end

  //make empty for exercise 
  outcolour = vec4(1,1,1,1);


  //support mouse based interaction
  vec4 ray_origin = modelViewMatrix * vec4(origin.x, origin.y, origin.z, 1.0);
  main_ray.origin = ray_origin.xyz / ray_origin.w;
  main_ray.dir = normalize(vec4(dir.x, dir.y, dir.z, 1.0) * modelViewMatrix);

  Intersaction i;

  int currentDepth = 1;
   
  do {
    Intersect(main_ray, i);
    vec3 colour = ambient_factor * i.colour + computeShadow(i);
    outcolour.xyz += colour * pow(reflectivity, currentDepth);
    main_ray.origin = i.point + epsilon*i.normal;
    main_ray.dir = reflect(main_ray.dir, i.normal);

    currentDepth++;
  } while (i.hit == 1 && currentDepth < raytraceDepth)


}