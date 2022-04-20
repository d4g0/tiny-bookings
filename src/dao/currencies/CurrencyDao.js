import { CURRENCIES, setCurrencyId } from "dao/DBConstans";
import { isValidCurrnecy } from "dao/utils";
import sql from "db/postgres";



export async function createCurrency(currency_key) {

    if (!isValidCurrnecy(currency_key)) {
        throw new Error('Non valid currency_key')
    }

    try {
        var cRes = await sql`
            insert into currencies (currency) values (${currency_key}) RETURNING *
        `
        var currency = cRes[0];
        return currency;
    } catch (error) {
        throw error
    }
}

export async function getCurrencyByKey(currency_key) {
    if (!isValidCurrnecy(currency_key)) {
        throw new Error('Non valid currency_key')
    }

    try {
        var cRes = await sql`
            select * from currencies cs where cs.currency = ${currency_key};
        `
        var currency = cRes.length > 0 ? cRes[0] : null;
        return currency;
    } catch (error) {
        throw error;
    }
}


export async function initCurrencies() {

    try {
        var usd = await getCurrencyByKey(CURRENCIES.USD.key);

        if (!usd) {
            usd = await createCurrency(CURRENCIES.USD.key);
        }

        setCurrencyId(usd.currency, usd.id);
    } catch (error) {
        throw error;
    }
}