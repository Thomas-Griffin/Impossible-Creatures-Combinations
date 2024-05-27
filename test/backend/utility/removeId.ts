export const removeId = (object: any) => {
    let {_id, ...otherFields} = object
    return otherFields
}
