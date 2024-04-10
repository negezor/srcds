export function concatPattern(literals: TemplateStringsArray, ...placeholders: (string | RegExp)[]): RegExp {
    let result = '';

    for (let i = 0; i < placeholders.length; i += 1) {
        result += literals[i];

        const { [i]: placeholder } = placeholders;

        result += placeholder instanceof RegExp ? placeholder.source : placeholder;
    }

    result += literals[literals.length - 1];

    return new RegExp(result);
}
