#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;
uniform sampler2D palette_sampler;

uniform int levels;

void main()
{
  /* variable declarations */
  ivec2 texture_dim;
  vec2  texture_step;

  ivec2 palette_dim;
  vec2  palette_step;

  vec2  tex_coord_center;
  vec2  pal_coord_center;

  vec3  sample;

  vec2  decomp;
  float divisor;
  float fade_scale;

  /* note that the texture_sampler in this shader     */
  /* refers to the intermediate framebuffer texture.  */

  /* obtain texture dimensions */
  texture_dim = textureSize(texture_sampler, 0);
  texture_step = vec2(1.0 / texture_dim.x, 1.0 / texture_dim.y);

  /* compute center of texel on texture */
  tex_coord_center.x = (floor(texcoord.x * texture_dim.x) + 0.5) * texture_step.x;
  tex_coord_center.y = (floor(texcoord.y * texture_dim.y) + 0.5) * texture_step.y;

  /* obtain sample from texture */
  sample = texture(texture_sampler, tex_coord_center).xyz;

  /* note that the three components of the framebuffer are: */
  /*   r: index of the color in the palette                 */
  /*   g: combined lighting and palette settings            */
  /*   b: extra fade-in/fade-out and menu panel lighting    */

  /* obtain palette dimensions */
  palette_dim = textureSize(palette_sampler, 0);
  palette_step = vec2(1.0 / palette_dim.x, 1.0 / palette_dim.y);

  /* initialize divisor */
  divisor = levels * palette_step.y;

  /* initialize the decomposed lighting/palette coord,    */
  /* removing an extra half-pixel from the combined value */
  decomp.x = floor(sample.y * palette_dim.y) * palette_step.y;
  decomp.y = decomp.x;

  /* decompose the sample's lighting/palette coord back into 2 components */
  decomp.x = mod(decomp.x, divisor);
  decomp.y = (floor(decomp.y / divisor) * divisor) + 0.5 * palette_step.y;

  /* if the lighting value is past the midpoint of the palette  */
  /* levels (i.e., the tile or sprite is brightened), we want   */
  /* to scale the extra fade-in/fade-out shift appropriately.   */
  /* Note that this shift is normally set up to go across half  */
  /* the palette levels during a fade transition.               */
  fade_scale = max(1.0, decomp.x / (0.5 * divisor));

  /* subtract the fade or panel shift from the lighting component */
  decomp.x = max(0.0, decomp.x - (fade_scale * sample.z));

  /* compute center of texel on palette */
  pal_coord_center.x = (floor(sample.x * palette_dim.x) + 0.5) * palette_step.x;
  pal_coord_center.y = (floor((decomp.x + decomp.y) * palette_dim.y) + 0.5) * palette_step.y;

  /* obtain final color from the palette */
  frag_color = texture(palette_sampler, pal_coord_center).xyz;
}
