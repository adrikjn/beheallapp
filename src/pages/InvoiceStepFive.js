import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const InvoiceStepFive = () => {
  const token = localStorage.getItem("Token");
  const invoiceId = localStorage.getItem("invoice");
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!invoiceId) {
      navigate("/invoice-step-one"); // Redirection vers invoice-step-one si invoiceId est nul
    }
  }, [token, navigate, invoiceId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/invoices/${invoiceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setInvoiceData(data);
        } else {
          navigate("/invoice-step-one");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la facture : ",
          error
        );
      }
    };

    fetchData();
  }, [invoiceId, navigate, token]);

  const sendInvoice = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/invoices/${invoiceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "envoyé" }), // Mettez à jour le statut ici
        }
      );

      if (response.ok) {
        localStorage.removeItem("invoice");
        localStorage.removeItem("InvoiceData");
        localStorage.removeItem("DraftInvoice");
        navigate("/dashboard");
      } else {
        navigate("/error");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la facture : ", error);
    }
  };

  const generateInvoicePDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait", // ou 'landscape'
      unit: "mm",
      format: "a4", // ou toute autre taille de page
    });

    pdf.setFont("helvetica");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0); // Couleur du texte : Noir

    const maxWidth = pdf.internal.pageSize.getWidth() * 0.9;
    const lineHeight = 5; // Hauteur de ligne

    // Fonction utilitaire pour ajouter du texte avec une largeur maximale
    const addTextWithMaxWidth = (text, x, y) => {
      const textPieces = pdf.splitTextToSize(text, maxWidth);
      textPieces.forEach((textPiece, index) => {
        pdf.text(x, y + index * lineHeight, textPiece);
      });
      return textPieces.length * lineHeight;
    };

    pdf.setFontSize(36);
    const headerText = "FACTURE";
    const headerTextWidth =
      (pdf.getStringUnitWidth(headerText) * pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const headerX = maxWidth - headerTextWidth;
    pdf.text(headerX, 15, headerText);

    pdf.setFontSize(10);
    const referenceText = `Référence facture : ${invoiceData?.billNumber.toUpperCase()}`;
    const referenceTextWidth =
      (pdf.getStringUnitWidth(referenceText) * pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const referenceX = maxWidth - referenceTextWidth;
    const referenceY = 21;

    pdf.text(referenceX, referenceY, referenceText);

    const rawDate = new Date(invoiceData?.createdAt);
    const day = rawDate.getDate();
    const month = String(rawDate.getMonth() + 1).padStart(2, "0");
    const year = rawDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const dateX = referenceX;
    const dateY = referenceY + 4;
    pdf.text(dateX, dateY, `Date : ${formattedDate}`);

    pdf.setFontSize(11);
    const leftXCompany = 15;
    const textYCompany = 30;
    pdf.setFont("helvetica", "bold");
    pdf.text(
      leftXCompany,
      textYCompany,
      `${invoiceData?.company?.name.toUpperCase()}`
    );
    pdf.setFont("helvetica", "normal"); // Revenir à la police normale
    pdf.text(leftXCompany, textYCompany + 6, `${invoiceData?.company?.email}`);
    pdf.text(
      leftXCompany,
      textYCompany + 12,
      `${invoiceData?.company?.phoneNumber}`
    );
    pdf.text(
      leftXCompany,
      textYCompany + 18,
      `${invoiceData?.company?.address}, ${invoiceData?.company?.postalCode}, ${invoiceData?.company?.city}`
    );
    pdf.text(
      leftXCompany,
      textYCompany + 24,
      `${invoiceData?.company?.sirenSiret}`
    );
    pdf.text(leftXCompany, textYCompany + 30, `${invoiceData?.company?.vatId}`);

    // Informations sur le destinataire
    pdf.setFontSize(11);
    const rightXCustomer = 131;
    const textYCustomer = 49;
    pdf.setFont("helvetica", "bold");
    pdf.text(
      rightXCustomer,
      textYCustomer,
      `${invoiceData?.customer?.companyName.toUpperCase()}`
    );
    pdf.setFont("helvetica", "normal"); // Revenir à la police normale
    pdf.text(
      rightXCustomer,
      textYCustomer + 6,
      `${invoiceData?.customer?.lastName?.toUpperCase()} ${
        invoiceData?.customer?.firstName
          ? invoiceData?.customer?.firstName.charAt(0).toUpperCase() +
            invoiceData?.customer?.firstName.slice(1)
          : ""
      }`
    );

    pdf.text(
      rightXCustomer,
      textYCustomer + 12,
      `${invoiceData?.customer?.address}, ${invoiceData?.customer?.postalCode}, ${invoiceData?.customer?.city}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 18,
      `${invoiceData?.customer?.email}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 24,
      `${invoiceData?.customer?.phoneNumber}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 30,
      `${invoiceData?.customer?.sirenSiret}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 36,
      `${invoiceData?.customer?.vatId}`
    );

    // Objet/Descriptipn/Date etc..
    pdf.setFontSize(12);
    pdf.text(
      15,
      103,
      `${invoiceData?.title} ${
        invoiceData?.fromDate
          ? `du ${formatDate(invoiceData?.fromDate)} au ${formatDate(
              invoiceData?.deliveryDate
            )}`
          : formatDate(invoiceData?.deliveryDate)
      }`
    );

    // Tableau pour afficher les produits
    const zebraStyle = {
      startY: 108, // Ajustez la position Y en conséquence
      theme: "striped",
      tableWidth: "auto", // Ajustez la largeur de la table en conséquence
      styles: {
        font: "helvetica",
        fontSize: 10,
        textColor: [0, 0, 0], // Couleur du texte : Noir
        cellPadding: 5,
        overflow: "split",
        halign: "center", // Centrer le contenu horizontalement
        valign: "middle", // Centrer le contenu verticalement
      },
      headStyles: {
        halign: "center", // Centrer le contenu horizontalement dans les en-têtes
        valign: "middle", // Centrer le contenu verticalement dans les en-têtes
        fillColor: [0, 0, 0], // Couleur de fond : Noir
        textColor: [255, 255, 255], // Couleur du texte : Blanc
      },
    };

    // Tableau pour afficher les produits en utilisant jsPDF-AutoTable
    const productsTable = {
      headers: ["Intitulés", "Volumes", "Tarif", "TVA", "Prix HT"],
      rows: [],
    };

    let isGray = false;

    invoiceData?.services?.forEach((service) => {
      const titleWithDescription = `${service.title}\n - ${service.description}`;
      const fillColor = isGray ? [192, 192, 192] : [255, 255, 255];
      productsTable.rows.push([
        { content: titleWithDescription, fillColor },
        { content: service.quantity, fillColor },
        { content: `${service.unitCost}€`, fillColor },
        { content: `${service.vat}%`, fillColor },
        { content: `${service.totalPrice}€`, fillColor },
      ]);
      isGray = !isGray; // Alterne la couleur pour chaque ligne
    });

    // Dessiner le tableau des produits avec les styles personnalisés
    pdf.autoTable(productsTable.headers, productsTable.rows, {
      ...zebraStyle,
    });

    // Calculer la hauteur totale du contenu
    const tableHeight = pdf.previousAutoTable.finalY || 0;
    const contentBelowTableHeight = 12; // Ajoutez la hauteur du contenu en dessous du tableau
    const totalContentHeight = tableHeight + contentBelowTableHeight;

    // Définir la position Y pour le contenu en dessous du tableau
    let contentY = totalContentHeight;

    const pageHeight = pdf.internal.pageSize.getHeight();

    // Vérifier si le contenu en dessous peut tenir sur la page actuelle
    if (contentY > pageHeight - 20) {
      // Si le contenu ne tient pas sur la page actuelle, ajoutez une nouvelle page
      pdf.addPage();
      // Réinitialisez la position Y pour le contenu en dessous
      contentY = 20;

      // Numérotez la page
      pdf.text(10, pageHeight - 10, `Page ${pdf.internal.getNumberOfPages()}`);
    }

    // Calculer le Total HT en additionnant tous les service.totalPrice
    const totalHT = invoiceData?.services?.reduce(
      (accumulator, service) => accumulator + service.totalPrice,
      0
    );

    // Calculer le Taux TVA en calculant la moyenne des taux de TVA de tous les services
    const totalServices = invoiceData?.services?.length || 1; // Assurez-vous que le dénominateur n'est pas nul
    const averageVATRate = (
      invoiceData?.services?.reduce(
        (accumulator, service) => accumulator + service.vat,
        0
      ) / totalServices || 0
    ).toFixed(2);

    // Calculer le Total TTC en utilisant la valeur existante
    const totalTTC = invoiceData?.totalPrice.toFixed(2);

    pdf.setFontSize(12);

    let xResults = 145;

    // Afficher le Total HT
    pdf.setFont("helvetica", "bold");
    pdf.text("Total HT:", xResults, contentY);
    const totalHTString = totalHT.toFixed(2) + " €";
    pdf.text(totalHTString.toString(), xResults + 24, contentY); // Utilisez une position légèrement décalée

    // Déplacer vers la prochaine ligne
    contentY += 10;

    // Afficher l'Average VAT Rate
    pdf.setFont("helvetica", "normal");
    pdf.text("TVA:", xResults, contentY);
    const averageVATRateString = averageVATRate + " %";
    pdf.text(averageVATRateString.toString(), xResults + 24, contentY); // Utilisez une position légèrement décalée

    // Déplacer vers la prochaine ligne
    contentY += 10;

    // Afficher le Total TTC
    pdf.setFont("helvetica", "bold");
    pdf.text("Total TTC:", xResults, contentY);
    const totalTTCString = totalTTC.toString() + " €";

    pdf.text(totalTTCString, xResults + 24, contentY); // Utilisez une position légèrement décalée

    contentY += 15;

    pdf.setFont("helvetica", "normal");
pdf.setFontSize(11);
const footerX = 15;

// Informations supplémentaires
contentY += addTextWithMaxWidth(
  `Conditions générales de vente : ${invoiceData?.description}`,
  footerX,
  contentY
);

// Le paiement doit être réalisé
contentY += addTextWithMaxWidth(
  `Le paiement doit être réalisé sous ${invoiceData?.billValidityDuration} à sa date d'émission, par ${invoiceData?.paymentMethod}.`,
  footerX,
  contentY
);



    // Télécharger le PDF avec un nom de fichier personnalisé
    const fileName = `${invoiceData?.company?.name
      .replace(/\s+/g, "_")
      .toUpperCase()}_Facture_${invoiceData?.billNumber.toUpperCase()}_${formatDate(
      invoiceData?.createdAt
    )}.pdf`;
    pdf.save(fileName);
  };

  // generateInvoicePDF();

  return (
    <div className="invoice-step-one-page">
      <div className="welcome-user">
        <h1>Recapitulatif</h1>
        <Account />
      </div>
      <div className="summary">
        <button onClick={generateInvoicePDF}>
          <img src="bill-pdf-dl.svg" alt="" />
        </button>

        <div className="company-summary">
          <h2>Expéditaire</h2>
          <div className="company-summary-part">
            <div className="company-info-1">
              <p>
                {userData?.lastName?.toUpperCase()}{" "}
                {userData?.firstName
                  ? userData.firstName.charAt(0).toUpperCase() +
                    userData.firstName.slice(1)
                  : ""}
              </p>
              <p>{invoiceData?.company?.name}</p>
              <p> {invoiceData?.company?.sirenSiret}</p>
              <p> {invoiceData?.company?.vatId}</p>
            </div>
            <div className="company-info-2">
              <p>
                {invoiceData?.company?.address} {invoiceData?.company?.city}{" "}
                {invoiceData?.company?.postalCode}
              </p>
              <p>{invoiceData?.company?.email}</p>
              <p>{invoiceData?.company?.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="customer-summary">
          <h2>Clients</h2>
          <div className="customer-summary-part">
            <div className="customer-info-1">
              <p>
                {invoiceData?.customer?.companyName} (
                {invoiceData?.customer?.lastName?.toUpperCase()}{" "}
                {invoiceData?.customer?.firstName
                  ? invoiceData.customer.firstName.charAt(0).toUpperCase() +
                    invoiceData.customer.firstName.slice(1)
                  : ""}
                )
              </p>
              <p>{invoiceData?.customer?.email}</p>
              <p>{invoiceData?.customer?.sirenSiret}</p>
            </div>
            <div className="customer-info-2">
              <p>
                {invoiceData?.customer?.address} {invoiceData?.customer?.city}{" "}
                {invoiceData?.customer?.postalCode}
              </p>
              <p>{invoiceData?.customer?.phoneNumber}</p>
              <p>{invoiceData?.customer?.vatId}</p>
            </div>
          </div>
        </div>
        <div className="products-summary">
          <h2>Produits</h2>
          <div className="product-summary-part">
            <ul className="product-summary-header">
              <li>Intitulés</li>
              <li>Volumes</li>
              <li>Tarifs</li>
              <li>TVA</li>
              <li>Prix HT</li>
            </ul>
            {invoiceData?.services?.map((service) => (
              <ul className="product-summary-item" key={service.id}>
                <li>
                  {service.title} <p>- {service.description}</p>
                </li>
                <li>{service.quantity}</li>
                <li>{service.unitCost}€</li>
                <li>{service.vat}%</li>
                <li>{service.totalPrice}€</li>
              </ul>
            ))}
          </div>
          <div className="summary-details">
            <div className="summary-total">
              <p>Details :</p>
              <p>PRIX TTC : {invoiceData?.totalPrice.toFixed(2)}€</p>
            </div>
            <p>Objet : {invoiceData?.title}</p>
            <p>Description : {invoiceData?.description}</p>
            <p>Numéro de facture : {invoiceData?.billNumber.toUpperCase()}</p>
            <p>
              Date de l'opération:{" "}
              {invoiceData?.fromDate
                ? `${formatDate(invoiceData?.fromDate)} - ${formatDate(
                    invoiceData?.deliveryDate
                  )}`
                : formatDate(invoiceData?.deliveryDate)}
            </p>
            <p>
              Durée de validité de la facture :{" "}
              {invoiceData?.billValidityDuration}
            </p>
            <p>Moyen de paiement : {invoiceData?.paymentMethod}</p>
          </div>

          <div className="btn-invoice-2">
            <button onClick={sendInvoice}>Envoyer</button>
          </div>
        </div>
      </div>
      <AccordionNav />
    </div>
  );
};
