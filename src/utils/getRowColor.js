export const getRowColor = (product, rules) => {
    if (!rules) return 'transparent'; // Add a check to ensure rules is defined

    const productRules = rules.filter(rule => rule.product_id === product.product_id);
    const sortedRules = productRules.sort((a, b) => a.amount - b.amount);

    for (const rule of sortedRules) {
        const { comparison, amount, color } = rule;
        switch (comparison) {
            case '=':
                if (product.amount === amount) return color;
                break;
            case '<':
                if (product.amount < amount) return color;
                break;
            case '>':
                if (product.amount > amount) return color;
                break;
            case '<=':
                if (product.amount <= amount) return color;
                break;
            case '>=':
                if (product.amount >= amount) return color;
                break;
            default:
                break;
        }
    }
    return 'transparent';
};