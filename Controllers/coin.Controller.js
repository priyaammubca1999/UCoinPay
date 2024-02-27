const express = require('express');
const axios = require('axios');
const url = process.env.NODE_COIN_GECKO_API;


exports.getCoinData = async (req, res) => {
    try {
        axios.get(`${url}inr`)
            .then((response) => {
                axios.get(`${url}usd`).then((resp) => {
                    let obj = { usd: resp.data.ultrapro.usd, inr: response.data.ultrapro.inr }
                    return res.status(200).send({ status: true, data: obj, message: "Fetched" })
                })
            })
            .catch((error) => {
                console.log('error: ', error);
                return res.status(404).send({ status: false, message: "Failed to Fetch" })
            });

    } catch (error) {
        console.log('error: ', error);
        return res.status(404).send({ status: false, message: 'Something Went Wrong' });
    }

}