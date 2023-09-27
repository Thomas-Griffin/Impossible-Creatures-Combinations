const ModMissingError = {
    error: 'Mod Missing',
    message: 'A mod has not been supplied.',
    status: 500
}

const ModNameError = {
    error: 'Invalid mod name',
    message: 'The mod name you are trying to use is invalid.',
    status: 500
}

const ModVersionError = {
    error: 'Invalid mod version',
    message: 'The mod version you are trying to use is invalid.',
    status: 500
}

const AttributeError = {
    error: 'Invalid Attribute',
    message: 'Attribute does not exist',
    status: 500
}

const AttributeNotSuppliedError = {
    error: 'Missing Attribute',
    message: 'A valid Attribute was not supplied',
    status: 500
}

const PageNumberMissingError = {
    error: 'Missing Page Number',
    message: 'A valid Page Number was not supplied',
    status: 500
};
const NPerPageMissingError = {
    error: 'Missing Number Per Page',
    message: 'A valid Number Per Page was not supplied',
    status: 500
};

module.exports = {
    ModMissingError,
    ModNameError,
    ModVersionError,
    AttributeError,
    AttributeNotSuppliedError,
    PageNumberMissingError,
    NPerPageMissingError
}