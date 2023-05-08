#version 330 core

/* input variables */
layout (location = 0) in vec3 vertex_position;
layout (location = 1) in vec2 vertex_texcoord;
layout (location = 2) in vec2 vertex_lighting_and_palette;

/* output variables */
out vec2 texcoord;
out vec2 lighting_and_palette;

/* uniform variables */
uniform mat4 mvp_matrix;

void main()
{
  /* multiply by modelviewprojection matrix */
  gl_Position = mvp_matrix * vec4(vertex_position, 1.0);

  /* pass through texture coordinates and lighting/palette info */
  texcoord = vertex_texcoord;
  lighting_and_palette = vertex_lighting_and_palette;
}
