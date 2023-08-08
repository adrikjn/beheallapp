export const Register = () => {
  return (
    <div className="login-page">
      <div className="register-part-one">
        <h2>
          Be<span>heall</span>
        </h2>
        <div className="login-facture-image">
          <img src="/facture.png" alt="facture" />
        </div>
      </div>
        <h1 className="">Inscription</h1>
      <div className="register">
        <div className="name-inputs">
          <input type="text" placeholder="Prenom" />
          <input type="text" placeholder="Nom" />
        </div>
        <input type="text" placeholder="Nom de la société" />
        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Mot de passe" />
        <input type="password" placeholder="Confirmation du mot de passe" />
      </div>
    </div>
  );
};
