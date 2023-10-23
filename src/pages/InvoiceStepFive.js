import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer.js";

export const InvoiceStepFive = () => {
  const token = localStorage.getItem("Token");
  const invoiceId = localStorage.getItem("invoice");
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const signatureCanvasRef = useRef(null);
  const [signatureDataURL, setSignatureDataURL] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  const startDrawing = (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = signatureCanvasRef.current.getContext("2d");
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  };

  const endDrawing = () => {
    isDrawing = false;
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataURL(null);
  };

  useEffect(() => {
    if (signatureDataURL) {
      generateInvoicePDF();
    }
    // eslint-disable-next-line
  }, [signatureDataURL]);

  const captureSignature = () => {
    const canvas = signatureCanvasRef.current;
    const signatureData = canvas.toDataURL("image/png");
    setSignatureDataURL(signatureData);

    // generateInvoicePDF();
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!invoiceId) {
      navigate("/invoice-step-one");
    }
  }, [token, navigate, invoiceId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/invoices/${invoiceId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInvoiceData(data);
        } // } else {
        //   navigate("/invoice-step-one");
        // }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la facture : ",
          error
        );
      }
    };

    fetchData();
  }, [invoiceId, navigate, token, apiUrl]);

  const sendInvoice = async () => {
    try {
      const response = await fetch(`${apiUrl}/invoices/${invoiceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "envoyé" }),
      });

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
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.setFont("helvetica");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    const maxWidth = pdf.internal.pageSize.getWidth() * 0.9;
    const lineHeight = 5;

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
    pdf.setFont("helvetica", "normal");
    pdf.text(leftXCompany, textYCompany + 6, `${invoiceData?.company?.email}`);
    pdf.text(
      leftXCompany,
      textYCompany + 12,
      `${invoiceData?.company?.phoneNumber}`
    );
    pdf.text(
      leftXCompany,
      textYCompany + 18,
      `${invoiceData?.company?.address}`
    );

    pdf.text(
      leftXCompany,
      textYCompany + 24,
      `${invoiceData?.company?.postalCode}, ${invoiceData?.company?.city}`
    );
    pdf.text(
      leftXCompany,
      textYCompany + 30,
      `${invoiceData?.company?.sirenSiret}`
    );
    pdf.text(leftXCompany, textYCompany + 36, `${invoiceData?.company?.vatId}`);

    pdf.setFontSize(11);
    const rightXCustomer = 125;
    const textYCustomer = 50;
    pdf.setFont("helvetica", "bold");
    pdf.text(
      rightXCustomer,
      textYCustomer,
      `${invoiceData?.customer?.companyName.toUpperCase()}`
    );
    pdf.setFont("helvetica", "normal");
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
      `${invoiceData?.customer?.address}`
    );

    pdf.text(
      rightXCustomer,
      textYCustomer + 18,
      `${invoiceData?.customer?.postalCode}, ${invoiceData?.customer?.city}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 24,
      `${invoiceData?.customer?.email}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 30,
      `${invoiceData?.customer?.phoneNumber}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 36,
      `${invoiceData?.customer?.sirenSiret}`
    );
    pdf.text(
      rightXCustomer,
      textYCustomer + 42,
      `${invoiceData?.customer?.vatId}`
    );

    pdf.setFontSize(12);
    pdf.text(
      15,
      98,
      `${invoiceData?.title} ${
        invoiceData?.fromDate
          ? `du ${formatDate(invoiceData?.fromDate)} au ${formatDate(
              invoiceData?.deliveryDate
            )}`
          : `du ${formatDate(invoiceData?.deliveryDate)}`
      }`
    );

    const zebraStyle = {
      startY: 104,
      theme: "striped",
      tableWidth: "auto",
      styles: {
        font: "helvetica",
        fontSize: 10,
        textColor: [0, 0, 0],
        cellPadding: 3,
        overflow: "split",
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        halign: "center",
        valign: "middle",
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
    };

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
      isGray = !isGray;
    });

    pdf.autoTable(productsTable.headers, productsTable.rows, {
      ...zebraStyle,
    });

    const tableHeight = pdf.previousAutoTable.finalY || 0;
    const contentBelowTableHeight = 12;
    const totalContentHeight = tableHeight + contentBelowTableHeight;

    let contentY = totalContentHeight;

    const pageHeight = pdf.internal.pageSize.getHeight();

    if (contentY > pageHeight - 30) {
      pdf.addPage();
      contentY = 20;

      pdf.text(10, pageHeight - 10, `Page ${pdf.internal.getNumberOfPages()}`);
    }

    const totalHT = invoiceData?.services?.reduce(
      (accumulator, service) => accumulator + service.totalPrice,
      0
    );

    const totalServices = invoiceData?.services?.length || 1;
    const averageVATRate = (
      invoiceData?.services?.reduce(
        (accumulator, service) => accumulator + service.vat,
        0
      ) / totalServices || 0
    ).toFixed(2);

    const totalTTC = invoiceData?.totalPrice.toFixed(2);

    pdf.setFontSize(12);

    let xResults = 145;

    pdf.setFont("helvetica", "bold");
    pdf.text("Total HT:", xResults, contentY);
    const totalHTString = totalHT.toFixed(2) + " €";
    pdf.text(totalHTString.toString(), xResults + 24, contentY);

    contentY += 9;

    pdf.setFont("helvetica", "normal");
    pdf.text("TVA:", xResults, contentY);
    const averageVATRateString = averageVATRate + " %";
    pdf.text(averageVATRateString.toString(), xResults + 24, contentY);

    contentY += 9;

    pdf.setFont("helvetica", "bold");
    pdf.text("Total TTC:", xResults, contentY);
    const totalTTCString = totalTTC.toString() + " €";

    pdf.text(totalTTCString, xResults + 24, contentY);

    contentY += 12;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const footerX = 15;

    contentY += addTextWithMaxWidth(
      `Conditions générales de vente : ${invoiceData?.description}`,
      footerX,
      contentY
    );

    contentY += addTextWithMaxWidth(
      `Le paiement doit être réalisé sous ${invoiceData?.billValidityDuration} à sa date d'émission, par ${invoiceData?.paymentMethod}.`,
      footerX,
      contentY
    );

    if (signatureDataURL) {
      contentY += 5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const signatureDate = `Signé le ${formatDate(new Date())}`;

      const dateX = 150;
      pdf.text(signatureDate, dateX, contentY);

      const imgWidth = 50;
      const imgHeight = (imgWidth * 200) / 400;

      const imgX = 150;
      pdf.addImage(
        signatureDataURL,
        "PNG",
        imgX,
        contentY,
        imgWidth,
        imgHeight
      );
      contentY += imgHeight + 10;
    }

    const fileName = `${invoiceData?.company?.name
      .replace(/\s+/g, "_")
      .toUpperCase()}_Facture_${invoiceData?.billNumber.toUpperCase()}_${formatDate(
      invoiceData?.createdAt
    )}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className="invoice-step-one-page fade-in">
      <Helmet>
        <title>Récapitulatif & Finalisation | Beheall</title>
      </Helmet>
      <div className="welcome-user">
        <h1>Finalisation</h1>
        <Account />
      </div>
      <div className="pdf-mobile">
        <h2>Télécharger le PDF :</h2>
        <button onClick={captureSignature}>
          <img
            src="bill-pdf-dl.svg"
            alt="Télécharger la facture au format PDF"
            className="dl-pdf-img"
          />
        </button>
      </div>
      <div className="contents-try">
        <div className="dl-pdf">
          <h2>
            Veuillez signer la facture puis cliquer sur l'icône PDF pour la
            télécharger
          </h2>
          <button onClick={captureSignature}>
            <img
              src="bill-pdf-dl.svg"
              alt="Télécharger la facture au format PDF"
              className="dl-pdf-img"
            />
          </button>
        </div>
        <div className="sign-pdf-div">
          <canvas
            className="canva-signature"
            ref={signatureCanvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseOut={endDrawing}
          ></canvas>
          <img
            src="erase-signature.svg"
            alt="Effacer la signature"
            className="clear-signature-button"
            onClick={clearSignature}
          />
        </div>
      </div>
      <div className="summary">
        <div className="company-customer-summary">
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
            <h2>Client</h2>
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
              <ul
                className={`product-summary-item ${
                  isSmallScreen ? "small-screen" : "large-screen"
                }`}
                key={service.id}
              >
                <li>
                  {service.title.length > (isSmallScreen ? 8 : 25)
                    ? `${service.title.substring(0, isSmallScreen ? 8 : 25)}...`
                    : service.title}{" "}
                  <p>
                    -{" "}
                    {service.description.length > (isSmallScreen ? 8 : 25)
                      ? `${service.description.substring(
                          0,
                          isSmallScreen ? 8 : 25
                        )}...`
                      : service.description}
                  </p>
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
              <p>Objet : {invoiceData?.title}</p>
              <p>PRIX TTC : {invoiceData?.totalPrice.toFixed(2)}€</p>
            </div>
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
          <div className="btn-invoice-5">
            <button onClick={sendInvoice}>Création de la facture</button>
          </div>
        </div>
      </div>
      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};
