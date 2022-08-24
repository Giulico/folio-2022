// Attributes
import attributes from './attributes.glsl?raw'
import varyings from './varyings.glsl?raw'

// Vertex
import vertex from './vertex.glsl?raw'

// Utils
import median from './median.glsl?raw'

// Common
import common from './common.glsl?raw'
import commonUniforms from './common-uniforms.glsl?raw'

// Strokes
import strokes from './strokes.glsl?raw'
import strokesUniforms from './strokes-uniforms.glsl?raw'

// Alpha Test
import alphaTest from './alpha-test.glsl?raw'

// Outputs
import commonOutput from './common-output.glsl?raw'
import strokesOutput from './strokes-output.glsl?raw'

export default {
  // Attributes
  three_msdf_attributes: attributes,

  // Varyings
  three_msdf_varyings: varyings,

  // Vertex
  three_msdf_vertex: vertex,

  // Utils
  three_msdf_median: median,

  // Common
  three_msdf_common: common,
  three_msdf_common_uniforms: commonUniforms,

  // Strokes
  three_msdf_strokes: strokes,
  three_msdf_strokes_uniforms: strokesUniforms,

  // Alpha test
  three_msdf_alpha_test: alphaTest,

  // Output
  three_msdf_common_output: commonOutput,
  three_msdf_strokes_output: strokesOutput
}
