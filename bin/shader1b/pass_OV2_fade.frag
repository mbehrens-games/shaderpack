#version 330 core

/* input variables (from vertex shader) */
in vec2   texture_coord;
in float  palette_coord;

/* output variables */
layout (location = 0) out vec4  frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;
uniform sampler2D palette_sampler;

uniform int fade_amount;
uniform int subpalette_size;

void main()
{
  /* variable declarations */
  ivec2 palette_dim;
  vec2  palette_step;

  float column;
  float row;

  int   subpalette;
  int   index;
  int   faded;

  /* determine column */
  column = texture(texture_sampler, texture_coord).r;

  /* obtain palette dimensions */
  palette_dim = textureSize(palette_sampler, 0);
  palette_step = vec2(1.0 / palette_dim.x, 1.0 / palette_dim.y);

  /* determine subpalette and index */
  subpalette = int(floor(palette_coord * palette_dim)) / subpalette_size;
  index = int(floor(palette_coord * palette_dim)) % subpalette_size;

  /* add fade amount */
  /* note that if this on-screen element has been brightened,   */
  /* it is reset to the middle level (subpalette_size / 2) so   */
  /* that the fade will send it all the way to black properly.  */
  faded = clamp(min((subpalette_size / 2), index) - fade_amount, 0, subpalette_size - 1);

  /* determine row */
  row = ((subpalette * subpalette_size + faded) + 0.5) * palette_step.y;

  /* obtain sample from palette texture */
  frag_color = texture(palette_sampler, vec2(column, row));
}
