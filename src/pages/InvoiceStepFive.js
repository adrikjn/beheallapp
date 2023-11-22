// Importation des modules nécessaires depuis React et d'autres bibliothèques
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
 Page de finalisation d'une facture. Permet à l'utilisateur de signer électroniquement la facture, de générer un fichier PDF de la facture signée,
 et de finaliser l'envoi de la facture.
 */
export const InvoiceStepFive = () => {
  // Récupération du jeton JWT du localStorage
  const token = localStorage.getItem("Token");

  // Récupération de l'identifiant de la facture depuis le localStorage
  const invoiceId = localStorage.getItem("invoice");

  // Récupération des données utilisateur stockées localement
  const userData = JSON.parse(localStorage.getItem("UserData"));

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // État local pour stocker les données de la facture
  const [invoiceData, setInvoiceData] = useState(null);

  // Référence pour le canvas de signature
  const signatureCanvasRef = useRef(null);

  // État local pour stocker les données de signature sous forme d'URL
  const [signatureDataURL, setSignatureDataURL] = useState(null);

  // URL de l'API backend
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // État local pour déterminer si l'écran est de petite taille
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1200);

  useEffect(() => {
    // Fonction de gestionnaire pour mettre à jour l'état de l'écran lors du redimensionnement
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    // Ajout de l'écouteur d'événement pour le redimensionnement de la fenêtre
    window.addEventListener("resize", handleResize);

    // Nettoyage de l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Cette fonction prend une chaîne de caractères représentant une date en entrée
  function formatDate(dateString) {
    // Vérifie si la chaîne de caractères est vide ou indéfinie, si c'est le cas, retourne une chaîne vide
    if (!dateString) return "";

    // Crée une nouvelle instance de l'objet Date en utilisant la chaîne de caractères de la date en entrée
    const date = new Date(dateString);

    // Récupère le jour du mois (1-31) et le convertit en une chaîne de caractères avec un zéro devant si nécessaire
    const day = date.getDate().toString().padStart(2, "0");

    // Récupère le mois (0-11) et l'incrémente de 1 pour obtenir le mois réel (1-12), puis le convertit en une chaîne de caractères avec un zéro devant si nécessaire
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    // Récupère l'année à quatre chiffres
    const year = date.getFullYear();

    // Récupère l'année à quatre chiffres
    return `${day}/${month}/${year}`;
  }

  // Variables pour le dessin de la signature
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Fonction pour démarrer le dessin lors du clic sur le canvas
  const startDrawing = (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  // Fonction pour dessiner lors du déplacement de la souris sur le canvas
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

  // Fonction pour arrêter le dessin
  const endDrawing = () => {
    isDrawing = false;
  };

  // Fonction pour effacer la signature
  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataURL(null);
  };

  useEffect(() => {
    // Génération du fichier PDF lorsque l'URL de signature est mise à jour
    if (signatureDataURL) {
      generateInvoicePDF();
    }
    // eslint-disable-next-line
  }, [signatureDataURL]);

  // Fonction pour capturer la signature et mettre à jour l'état
  const captureSignature = () => {
    const canvas = signatureCanvasRef.current;
    const signatureData = canvas.toDataURL("image/png");
    setSignatureDataURL(signatureData);

    // generateInvoicePDF();
  };

  // Vérification de l'authentification et de l'existence de l'identifiant de facture
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!invoiceId) {
      navigate("/invoice-step-one");
    }
  }, [token, navigate, invoiceId]);

  // Récupération des données de la facture lors du chargement de la page
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
        } else {
          // Redirection vers la première étape si la facture n'est pas trouvée
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
  }, [invoiceId, navigate, token, apiUrl]);

  // Fonction pour envoyer la facture (met à jour le statut de la facture à "envoyé")
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
        // Nettoyage des données stockées localement et redirection vers le tableau de bord
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

  // Fonction pour générer le fichier PDF de la facture
  const generateInvoicePDF = () => {
    // Initialisation d'un nouveau document PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Configuration du style du texte
    pdf.setFont("helvetica");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    // Calcul de la largeur maximale du texte dans la page PDF
    const maxWidth = pdf.internal.pageSize.getWidth() * 0.9;
    const lineHeight = 5;

    // Fonction pour ajouter du texte avec une largeur maximale spécifiée
    const addTextWithMaxWidth = (text, x, y) => {
      const textPieces = pdf.splitTextToSize(text, maxWidth);
      textPieces.forEach((textPiece, index) => {
        pdf.text(x, y + index * lineHeight, textPiece);
      });
      return textPieces.length * lineHeight;
    };

    // Ajout du titre de la facture
    pdf.setFontSize(36);
    const headerText = "FACTURE";
    const headerTextWidth =
      (pdf.getStringUnitWidth(headerText) * pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const headerX = maxWidth - headerTextWidth;
    pdf.text(headerX, 15, headerText);

    // Ajout de la référence de la facture
    pdf.setFontSize(10);
    const referenceText = `Référence facture : ${invoiceData?.billNumber.toUpperCase()}`;
    const referenceTextWidth =
      (pdf.getStringUnitWidth(referenceText) * pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const referenceX = maxWidth - referenceTextWidth;
    const referenceY = 21;
    pdf.text(referenceX, referenceY, referenceText);

    // Formatage de la date
    const rawDate = new Date(invoiceData?.createdAt);
    const day = rawDate.getDate();
    const month = String(rawDate.getMonth() + 1).padStart(2, "0");
    const year = rawDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const dateX = referenceX;
    const dateY = referenceY + 4;
    pdf.text(dateX, dateY, `Date : ${formattedDate}`);

    // Informations sur l'expéditeur (entreprise)
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

    // Informations sur le client
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

    // Titre de la facture et période de l'opération
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

    // Style de tableau zébré
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

    // Configuration du tableau des produits
    const productsTable = {
      headers: ["Intitulés", "Volumes", "Tarif", "TVA", "Prix HT"],
      rows: [],
    };

    // Variable pour alterner la couleur de fond des lignes
    let isGray = false;

    // Ajout des lignes du tableau des produits
    invoiceData?.services?.forEach((service) => {
      // Création d'un titre avec une description pour le service
      const titleWithDescription = `${service.title}\n - ${service.description}`;

      // Définition de la couleur de fond en fonction du drapeau isGray
      const fillColor = isGray ? [192, 192, 192] : [255, 255, 255];

      // Ajout des détails du service à la table des produits
      productsTable.rows.push([
        { content: titleWithDescription, fillColor },
        { content: service.quantity, fillColor },
        { content: `${service.unitCost}€`, fillColor },
        { content: `${service.vat}%`, fillColor },
        { content: `${service.totalPrice}€`, fillColor },
      ]);

      // Basculement du drapeau isGray pour alterner les couleurs des lignes
      isGray = !isGray;
    });

    // Génération d'une table de produits dans le PDF en utilisant pdfmake
    pdf.autoTable(productsTable.headers, productsTable.rows, {
      ...zebraStyle,
    });

    // Calcul de la hauteur totale du contenu en dessous de la table
    const tableHeight = pdf.previousAutoTable.finalY || 0;
    const contentBelowTableHeight = 12;
    const totalContentHeight = tableHeight + contentBelowTableHeight;

    // Définition de la position Y initiale pour le contenu sur la page
    let contentY = totalContentHeight;

    // Obtention de la hauteur de la page
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Ajout d'une nouvelle page si contentY dépasse l'espace restant sur la page actuelle
    if (contentY > pageHeight - 30) {
      pdf.addPage();
      contentY = 20;

      // Ajout du numéro de page
      pdf.text(10, pageHeight - 10, `Page ${pdf.internal.getNumberOfPages()}`);
    }

    // Calcul des valeurs totales à partir de invoiceData.services
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

    // Définition de la taille de police pour le PDF
    pdf.setFontSize(12);

    // Positionnement pour afficher les valeurs totales
    let xResults = 145;

    // Ajout de Total HT au PDF
    pdf.setFont("helvetica", "bold");
    pdf.text("Total HT:", xResults, contentY);
    const totalHTString = totalHT.toFixed(2) + " €";
    pdf.text(totalHTString.toString(), xResults + 24, contentY);

    contentY += 9;

    // Ajout de la TVA au PDF
    pdf.setFont("helvetica", "normal");
    pdf.text("TVA:", xResults, contentY);
    const averageVATRateString = averageVATRate + " %";
    pdf.text(averageVATRateString.toString(), xResults + 24, contentY);

    contentY += 9;

    // Ajout de Total TTC au PDF
    pdf.setFont("helvetica", "bold");
    pdf.text("Total TTC:", xResults, contentY);
    const totalTTCString = totalTTC.toString() + " €";
    pdf.text(totalTTCString, xResults + 24, contentY);

    contentY += 12;

    // Ajout de texte supplémentaire au pied de page du PDF
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const footerX = 15;

    // Vérification si la TVA n'est pas applicable et ajout du texte associé
    if (averageVATRate === "0.00" || averageVATRate === null) {
      contentY += addTextWithMaxWidth(
        "TVA non applicable selon l'article 293 B du Code Général des Impôts.",
        footerX,
        contentY
      );
    }

    // Ajout des conditions générales de vente au pied de page du PDF
    contentY += addTextWithMaxWidth(
      `Conditions générales de vente : ${invoiceData?.description}`,
      footerX,
      contentY
    );

    // Ajout des informations de paiement au pied de page du PDF
    contentY += addTextWithMaxWidth(
      `Le paiement doit être réalisé sous ${invoiceData?.billValidityDuration} à sa date d'émission, par ${invoiceData?.paymentMethod}.`,
      footerX,
      contentY
    );

    // Ajout de la signature et de la date au PDF si signatureDataURL est disponible
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

    // Génération d'un nom de fichier pour le PDF
    const fileName = `${invoiceData?.company?.name
      .replace(/\s+/g, "_")
      .toUpperCase()}_Facture_${invoiceData?.billNumber.toUpperCase()}_${formatDate(
      invoiceData?.createdAt
    )}.pdf`;

    // Sauvegarde du fichier PDF avec le nom de fichier généré
    pdf.save(fileName);
  };

  return (
    <div className="invoice-step-one-page fade-in">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Récapitulatif & Finalisation | Beheall</title>
          <meta
            name="description"
            content="Consultez le récapitulatif de votre facture sur Beheall. Vérifiez les détails, signez électroniquement, et finalisez votre facture. Téléchargez le fichier PDF de la facture pour une documentation facile et professionnelle. Simplifiez la finalisation de vos transactions avec Beheall."
          />
        </Helmet>

        {/* Bloc avec le titre et le composant Account */}
        <div className="welcome-user">
          <h1>Finalisation</h1>
          <Account />
        </div>

        {/* Bloc pour le téléchargement du PDF sur les appareils mobiles */}
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

        {/* Contenu principal avec deux sections pour le téléchargement du PDF et la signature */}
        <div className="contents-try">
          {/* Section pour le téléchargement du PDF */}
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

          {/* Section pour la signature avec un canevas et un bouton pour effacer la signature */}
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

        {/* Section récapitulative avec les informations ) à l'aide de la sérialization de l'expéditeur, du client, des produits, etc. */}
        <div className="summary">
          <div className="company-customer-summary">
            <div className="company-summary">
              <h2>Expéditaire</h2>
              <div className="company-summary-part">
                {/* Informations sur l'expéditeur */}
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
                {/* Autres informations sur l'expéditeur. */}
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
                {/* Informations sur le client */}
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
                {/* Autres informations sur le client */}
                <div className="customer-info-2">
                  <p>
                    {invoiceData?.customer?.address}{" "}
                    {invoiceData?.customer?.city}{" "}
                    {invoiceData?.customer?.postalCode}
                  </p>
                  <p>{invoiceData?.customer?.phoneNumber}</p>
                  <p>{invoiceData?.customer?.vatId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc récapitulatif des produits/services de la facture */}
          <div className="products-summary">
            <h2>Produits</h2>
            <div className="product-summary-part">
              {/* En-tête de la liste des produits */}
              <ul className="product-summary-header">
                <li>Intitulés</li>
                <li>Volumes</li>
                <li>Tarifs</li>
                <li>TVA</li>
                <li>Prix HT</li>
              </ul>
              {/* Boucle sur les services de la facture pour afficher les détails de chaque service */}
              {invoiceData?.services?.map((service) => (
                <ul
                  className={`product-summary-item ${
                    isSmallScreen ? "small-screen" : "large-screen"
                  }`}
                  key={service.id}
                >
                  {/* Détails du service (intitulé, description, quantité, coût unitaire, TVA, prix total) */}
                  <li>
                    {service.title.length > (isSmallScreen ? 8 : 25)
                      ? `${service.title.substring(
                          0,
                          isSmallScreen ? 8 : 25
                        )}...`
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
            {/* Détails supplémentaires sur la facture (objet, prix total TTC, numéro de facture, dates, durée de validité, moyen de paiement) */}
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
        {/* Affichage de la navigation par onglets */}
        <AccordionNav />
        {/* Pied de page pour les écrans de bureau */}
        <div className="desktop-footer">
          <Footer />
        </div>
      </HelmetProvider>
    </div>
  );
};
