#version 330 core

/* input variables (from vertex shader) */
in vec2 texcoord;
in vec2 lighting_and_palette;

/* output variables */
layout (location = 0) out vec4 frag_color;

/* uniform variables */
uniform sampler2D texture_sampler;

void main()
{
  vec2 index_and_alpha;

  /* note that the texture_sampler in this shader refers  */
  /* to the graphics rom data texture (tiles / sprites).  */

  /* determine index and alpha */
  index_and_alpha = texture(texture_sampler, texcoord).rg;

  /* note that the three components of the framebuffer are: */
  /*   r: index of the color in the palette                 */
  /*   g: combined lighting and palette settings            */
  /*   b: extra fade-in/fade-out and menu panel lighting    */

  /* construct output color */
  frag_color = vec4(index_and_alpha.r, lighting_and_palette.x + lighting_and_palette.y, 0.0, index_and_alpha.g);
}
