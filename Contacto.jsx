import "./contacto.css"
import React, { useState, useRef }  from "react"
import Footer from "../../components/footer/Footer"
import {contactRequest} from "../../api/auth.js"
import {useForm} from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import RegisterZone from "../../components/registerZone/RegisterZone"
import Swal from "sweetalert2"
import ReCAPTCHA from "react-google-recaptcha";

const Contacto= ()=>{
    const captcha= useRef(null)
    const [contactSent, setContactSend]= useState(false)
    const [contactErrors, setContactErrors]= useState("")
    const navigate = useNavigate();
    const { register, handleSubmit, formState: errors, reset } = useForm();
    const onSubmit= handleSubmit(async (values)=> {
            try{
                const res= await contactRequest(values)
                setContactSend(true)
                reset()
            }
            catch(e){
                setContactErrors(e.response.data.message)
            }  
        })
    
    const handleContactAlert=()=>{
        Swal.fire({
            icon: 'success',
            title: 'Tu mensaje fue enviado correctamente, pronto recibirás una respuesta!',
            showConfirmButton: true,
        });
        navigate("/");
    }
    const onChange=()=>{
        if(captcha.current.getValue()){
            console.log("El usuario no es un robot")
        }
    }
    return(
        <>
        <div className="backColor">
            <div className="backOrg">
                {
                    contactSent
                    ?
                    (handleContactAlert())
                    :
                    (<>   
                    {contactErrors && <div className="errors">{contactErrors}</div>}
                    <h3 className="titleContact">Contactate con nosotros</h3>
                    <form className="formOrg" onSubmit= {onSubmit}>
                        <label htmlFor="NombreyApellido">Ingresa tu nombre y apellido</label>
                        <input type="text" {...register("NombreyApellido", {required: true})} name="NombreyApellido" id="NombreyApellido"/>
                        {errors.NombreyApellido && <p className="errors">El Nombre y Apellido son obligatorios</p>}
                        <label htmlFor="email">Ingresa tu email</label>
                        <input type="email" {...register("email", {required: true})} name="email" id="email"/>
                        {errors.email && <p className="errors">El email es obligatorio</p>}
                        <label htmlFor="mensaje">Dejanos tu mensaje</label>
                        <input type="text" {...register("mensaje", {required: true})} name="mensaje" id="mensaje"/>
                        {errors.mensaje && <p className="errors">El mensaje es obligatorio</p>}
                        <div className="reCaptchaContact">
                            <ReCAPTCHA
                                ref={captcha}
                                sitekey="6Ld55AcpAAAAAPCrgwOBR7mfjqXGjDfGRRmw36Eg"
                                onChange={onChange}
                            />
                        </div>
                        <button className="my-button" type="submit">Enviar mensaje</button>
                    </form></>)
                }
            </div>
        </div>
            <Footer/> 
        </>
    )
}

export default Contacto