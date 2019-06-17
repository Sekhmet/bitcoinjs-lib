// OP_DUP OP_HASH160 {pubKeyHash} OP_EQUALVERIFY OP_CHECKSIG

const bscript = require('../../script')
const OPS = require('bitcoin-ops')

const CUSTOM_OPS = {
  RVN: {
    RVN_R: 114,
    RVN_V: 118,
    RVN_N: 110,
    RVN_Q: 113,
    RVN_T: 116,
    RVN_O: 111,
    OP_RVN_ASSET: 192
  }
}

// https://github.com/RavenProject/Ravencoin/blob/323e75446936a8ecafc62c1f67b23320e54afec1/src/script/script.cpp#L245
function isRVNAssetScript (buffer) {
  if (buffer.length <= 30) return false
  if (buffer[25] !== CUSTOM_OPS.RVN.OP_RVN_ASSET) return false

  let index = -1

  if (
    buffer[27] === CUSTOM_OPS.RVN.RVN_R &&
    buffer[28] === CUSTOM_OPS.RVN.RVN_V &&
    buffer[29] === CUSTOM_OPS.RVN.RVN_N
  ) {
    index = 30
  } else if (
    buffer[28] === CUSTOM_OPS.RVN.RVN_R &&
    buffer[29] === CUSTOM_OPS.RVN.RVN_V &&
    buffer[30] === CUSTOM_OPS.RVN.RVN_N
  ) {
    index = 31
  }

  if (index < 0) return false

  if (buffer[index] === CUSTOM_OPS.RVN.RVN_T) return true
  else if (buffer[index] === CUSTOM_OPS.RVN.RVN_Q && buffer.length > 39) return true
  else if (buffer[index] === CUSTOM_OPS.RVN.RVN_O) return true
  else if (buffer[index] === CUSTOM_OPS.RVN.RVN_R) return true

  return false
}

function check (script) {
  const buffer = bscript.compile(script)

  if (buffer.length === 25) {
    return (
      buffer[0] === OPS.OP_DUP &&
      buffer[1] === OPS.OP_HASH160 &&
      buffer[2] === 0x14 &&
      buffer[23] === OPS.OP_EQUALVERIFY &&
      buffer[24] === OPS.OP_CHECKSIG
    )
  }

  return isRVNAssetScript(buffer)
}
check.toJSON = function () { return 'pubKeyHash output' }

module.exports = { check }
