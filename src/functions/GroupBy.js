/** @format */

const GroupBy = (input) => {
  let group = input.reduce((r, a) => {
    r[a.smenu_libelle] = [...(r[a.smenu_libelle] || []), a]
    return r
  }, {})

  return { group: group }
}

export default GroupBy
