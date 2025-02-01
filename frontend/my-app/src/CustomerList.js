import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerList() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/customers")
            .then((response) => setCustomers(response.data))
            .catch((error) => console.error("Fehler:", error));
    }, []);

    return (
        <div>
            <h2>Kundenliste</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>Rechnungsnr</th>
                    <th>Datum</th>
                    <th>Kunde</th>
                    <th>Text</th>
                    <th>Nettotage</th>
                    <th>Fälligkeit</th>
                    <th>Netto</th>
                    <th>Mwst</th>
                    <th>Brutto</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer, index) => (
                    <tr key={index}>
                        <td>{customer.invoiceNumber}</td>
                        <td>{customer.date}</td>
                        <td>{customer.customer}</td>
                        <td>{customer.text}</td>
                        <td>{customer.netDays}</td>
                        <td>{customer.dueDate}</td>
                        <td>{customer.netAmount}</td>
                        <td>{customer.vat}</td>
                        <td>{customer.grossAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerList;
