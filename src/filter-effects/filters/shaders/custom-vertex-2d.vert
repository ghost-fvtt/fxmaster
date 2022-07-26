// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: BSD-3-Clause

precision mediump float;

attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;
uniform vec4 inputSize;
uniform vec4 outputFrame;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

void main(void) {
  vTextureCoord = aVertexPosition * (outputFrame.zw * inputSize.zw);
  vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
  vFilterCoord = (filterMatrix * vec3(position, 1.0)).xy;
  gl_Position = vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}
