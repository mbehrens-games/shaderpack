#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;
in vec2 lighting_and_palette;

/* output variables */
layout (location = 0) out vec3 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

void main()
{
  float index;

  /* note that the texture_sampler in this shader refers  */
  /* to the graphics rom data texture (tiles / sprites).  */

  /* determine index */
  index = texture(texture_sampler, texcoord).r;

  /* note that the three components of the framebuffer are: */
  /*   r: index of the color in the palette                 */
  /*   g: combined lighting and palette settings            */
  /*   b: extra fade-in/fade-out and menu panel lighting    */

  /* construct output color */
  frag_color = vec3(index, lighting_and_palette.x + lighting_and_palette.y, 0.0);
}
