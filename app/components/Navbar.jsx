"use client"
import React from "react";
import "../styles/Navbar.css";
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="container">
      <div className="search">
        <h1 className="logo">IHAVEGPU</h1>

        <form>
          <input className="search-input" type="text" placeholder="Search Product"/>
          <input className="search-button" type="button" value="Search" />
        </form>

        {session ? (
          <>
            <span>{session.user.email}</span>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <button 
            className="login-button" 
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            Sign in with Google
          </button>
        )}

      </div>

      <nav>
        <ul>
          <li><a href="">หน้าแรก</a></li>
          <li><a href="">คอมพิวเตอร์เซต</a></li>
          <li><a href="">ติดต่อเรา</a></li>
        </ul>
      </nav>
    </div>
  );
}