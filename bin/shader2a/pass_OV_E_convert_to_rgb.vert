#version 330 core

/* input variables */
layout (location = 0) in vec3 vertex_position;
layout (location = 1) in vec2 vertex_texcoord;

/* output variables */
out vec2 texcoord;

/* uniform variables */
uniform mat4 mvp_matrix;

void main()
{
  /* multiply by modelviewprojection matrix */
  gl_Position = mvp_matrix * vec4(vertex_position, 1.0);

  /* pass through texture coordinates */
  texcoord = vertex_texcoord;
}
