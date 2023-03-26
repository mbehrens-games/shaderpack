#version 330 core

/* input variables (from vertex shader) */
in vec2   texture_coord;
in float  palette_coord;

/* output variables */
out vec4 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;
uniform sampler2D palette_sampler;

void main()
{
  float column;

  /* determine column */
  column = texture(texture_sampler, texture_coord).r;

  /* obtain sample from palette texture */
  frag_color = texture(palette_sampler, vec2(column, palette_coord));
}
