// src/pages/Settings.tsx
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import parsePhoneNumber from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

interface DecodedToken {
  sub: string;
  phoneNumber: string;
  email: string;
  role: string;
}

const Settings = () => {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userId = decoded.sub;

      api.get(`/users/${userId}`)
        .then(res => setUserData(res.data))
        .catch(() => navigate("/"));
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const formatPhoneNumber = (phone: string) =>
    parsePhoneNumber("+" + phone)?.formatInternational();

  if (!userData) return <></>;

  return (
    <Layout title={""} context={userData.fullName} back>
      <ul className="text-white flex flex-col gap-3">
        <li>Номер телефона: {formatPhoneNumber(userData.phoneNumber)}</li>
        <li>Электронная почта: {userData.email}</li>
        <li>Компания: {userData.company}</li>
        <li>Страна: {userData.country}</li>
        <li>Город: {userData.city}</li>
        <li>Адрес: {userData.address}</li>
        <li>Профессия: {userData.profession}</li>
      </ul>
    </Layout>
  );
};

export default Settings;
