"use client"
import React, { useState } from 'react';

export default function PixPayment() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pixQrCode, _] = useState<string | null>("iVBORw0KGgoAAAANSUhEUgAAAcIAAAHCAQAAAABUY/ToAAADjklEQVR4Xu2WQW7cQAwEdZv//yjP0s3ZquZIcoBgDedgBuBoJXGaXZ3DcNc5Pr65fh1/Kl9dQ75bQ75b/0Seh2t9fJzr5ElN+boOP0uJvt24h+xKImIFwEpD8SRhEzSNjHvIviRSLIceidteUcm53EM2J52EkAcJ5pjFszr6hvwfyDRS6q0J+GCVtnOH7EymZeNy1VRgqtCrEcuQXUlO3NP90lXuIf96/TB5L8/9sXE+mJBrKB7mIZuSnq0njAlGpPR8x0+qxBm2huxLArhPhMx+JJEkTM/gIbuSSPbT0RbSQoMFmuH4huxKosNFCXTnmJCGMds4ZFOymtq0Lvbi5pVhd7Y4ZFPSKQBVrhAFvRdJu4YGdMi2pHpahUoYGfwQMNzOqkkYsh+JY5s8YzfG1UToBdqjMWRzEqfIfsdaewUX2wodsinp0W7GukC3geg/U876P9iQ/UgaOuKt4krgfQBa+z23P2RTsqrwixfPvOiZpOWTYciu5KFDd/qcPUUGwCHZfTKiDtmU1Bqjq9xIO3HHxWb6kH3JQopZ+9rgWZPyWR2yKfk6Ws7dm+vAQ96q1qXXw6wh25J2Nbxuv8Xequ5jRywn+pBNSRXM2CxNyDbwVcfiPWRXEu8LKFedeGkIBBlGQpyrfuOHbEjqiR/PwipZGs7NqNkasisZJI6agxy7AVtJT6P1kE3J08PPIdeRV4WDDbtHPu39N3vInmQa3hjtl2UzqRKx7kkYshmZ1goKlWVemV1Atz5kW9Ime/jQ7pVMjKHi+QzZmKx+KHhBzJWEATlk2kP2JcsRmYI6dl7Ctdn/zv5NGLIdeeZkVcSDxU5WJfm5yiG7kvt474ds8PCFuOFNMWRnkq5f65cqWnXCNpx21CHbkkoLj/dRp5+MK9XaFB1DdiXPS90VraJAYn4E0BmyK2mDfgVIpJ2MY4MVhXnI3qQGSyq2vnGlnfwKOfcv9ZDtSEokvOIKWh8fEx7VkF1J3TzrtXM27zTEcJVDNiat/LZmGFbVtxONMENLG7Iv6cIdE1f6yXBWAt3JQzYlIx3l4VVGAxKn5DOG5SQM2ZK0Ge7AK5Sk8DQh2OkcsjWZPpdwbtRESAlkZpCH7E+WxO4SSaFeTks6GZshu5MYaWOEkU+goRoSc+Yv75AtSU85XNB6qB51+pmJTAH3kF3JfdBFkPFqsU1ctEyHPlOHbEp+cw35bg35bv0I+RtXuK05KKHCjgAAAABJRU5ErkJggg==");

  return (
    <div className="p-4">
      <button className="bg-blue-500 text-white p-2 rounded">
        Gerar QR Code PIX
      </button>

      <div className="mt-4">
        <p>Escaneie o QR Code:</p>
        {pixQrCode ? (
          <img
            src={`data:image/png;base64,${pixQrCode}`}
            alt="QR Code PIX"
            className="w-full max-w-xs"
          />
        ) : (
          <p>Carregando QR Code...</p>
        )}
      </div>

      <div className="mt-4">
        <p>Ou copie e cole a chave PIX:</p>

      </div>
    </div>
  );
}
