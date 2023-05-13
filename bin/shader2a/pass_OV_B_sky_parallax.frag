#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;
uniform sampler1D parallax_sampler;

uniform int hori_shift;
uniform int vert_shift;

#define OVERSCAN_WIDTH  320
#define OVERSCAN_HEIGHT 224

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  int   parallax_dim;
  float parallax_step;

  vec2  tex_coord_center;
  float par_coord_center;

  ivec2 pixel_position;
  float hori_weight;

  /* note that the texture_sampler in this shader     */
  /* refers to the intermediate framebuffer texture.  */

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* obtain parallax dimensions */
  parallax_dim = textureSize(parallax_sampler, 0);
  parallax_step = 1.0 / parallax_dim;

  /* determine the position of this pixel     */
  /* recall that for the texture coordinates, */
  /* the origin is at the lower left corner   */
  pixel_position.x = int(floor(texcoord.x * texture_dim.x));
  pixel_position.y = texture_dim.y - 1 - int(floor(texcoord.y * texture_dim.y));

  /* add vertical shift to pixel position */
  pixel_position.y += vert_shift;

  /* determine the parallax coord based on the scanline */
  par_coord_center = ((pixel_position.y % OVERSCAN_HEIGHT) + 0.5) * parallax_step;

  /* read weight from the parallax texture */
  hori_weight = texture(parallax_sampler, par_coord_center).x;

  /* add horizontal shift to pixel position */
  pixel_position.x += int(round(hori_weight * hori_shift));

  /* compute center of texel */
  tex_coord_center.x = ((pixel_position.x % OVERSCAN_WIDTH) + 0.5) * texture_step.x;
  tex_coord_center.y = ((texture_dim.y - 1 - (pixel_position.y % OVERSCAN_HEIGHT)) + 0.5) * texture_step.y;

  /* obtain sample from texture */
  frag_color = texture(texture_sampler, tex_coord_center).xyz;
}
