import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <div className="login-page">
      <div className="login-part-one">
        <h2>
          Be<span>heall</span>
        </h2>
        <div className="login-facture-image">
          <img src="/facture.png" alt="facture" />
        </div>
        <p className="login-description">On s'occupe de tout</p>
        <div className="login-border"></div>
      </div>
      <div className="login-part-two">
        <div className="login-space">
          <h1>Connexion</h1>
          <input type="text" placeholder="E-MAIL" />
          <input type="password" placeholder="MOT DE PASSE" />
          <p>Vous n'avez pas de compte ? <Link to="/register" className="register-link">S'inscrire</Link></p>
          <div className='center-btn'>
            <button>Se connecter</button>
          </div>  
        </div>
      </div>
    </div>
  );
};
