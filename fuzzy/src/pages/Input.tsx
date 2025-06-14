import React, { useState } from "react";

type HasilItem = {
  nama: string;
  pakar: number | undefined;
  sistem: number | undefined;
  rankPakar?: number;
  rankSistem?: number;
  di?: number;
  di2?: number;
};

const App: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [testScores, setTestScores] = useState({
    testTulis: "",
    keterampilan: "",
    wawancara: "",
    kesehatan: "",
  });
  const [hasil, setHasil] = useState<HasilItem[]>([]);
  const [spearman, setSpearman] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestScores((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcess = async () => {
    const payload = {
      nama: groupName,
      tulis: parseFloat(testScores.testTulis),
      keterampilan: parseFloat(testScores.keterampilan),
      wawancara: parseFloat(testScores.wawancara),
      kesehatan: parseFloat(testScores.kesehatan),
    };

    try {
      const response = await fetch("/logic/fuzzy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!Array.isArray(data.hasil)) {
        console.error("Data dari backend tidak sesuai.");
        return;
      }

      type BackendHasilItem = {
        nama: string;
        pakar: number | undefined;
        sistem: number | undefined;
        rank_pakar?: number;
        rank_sistem?: number;
        di?: number;
        di2?: number;
      };

      const hasilFromBackend: HasilItem[] = data.hasil.map((item: BackendHasilItem) => ({
        nama: item.nama,
        pakar: item.pakar,
        sistem: item.sistem,
        rankPakar: item.rank_pakar,
        rankSistem: item.rank_sistem,
        di: item.di,
        di2: item.di2,
      }));

      setHasil(hasilFromBackend);
      setSpearman(data.spearman_rho ?? null); // ← tambahkan ini
      setGroupName("");
      setTestScores({ testTulis: "", keterampilan: "", wawancara: "", kesehatan: "" });
    } catch (err) {
      console.error("Gagal memproses data:", err);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch("/logic/reset", {
        method: "POST",
      });
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Reset gagal");
      }
    } catch (error) {
      console.error("Terjadi error saat reset:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl lg:flex lg:gap-8 items-stretch">
        {/* Input Section */}
        <div className="bg-gray-200 p-6 rounded-lg w-full lg:w-1/2 shadow-md flex flex-col">
          <h2 className="text-center text-xl font-semibold mb-6 text-gray-800">Input Data</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Nama Kelompok", name: "groupName", value: groupName },
              { label: "Test Tulis", name: "testTulis", value: testScores.testTulis },
              { label: "Test Keterampilan", name: "keterampilan", value: testScores.keterampilan },
              { label: "Wawancara", name: "wawancara", value: testScores.wawancara },
              { label: "Test Kesehatan", name: "kesehatan", value: testScores.kesehatan },
            ].map((field, i) => (
              <div key={i} className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">{field.label}</label>
                <input
                  type={field.name === "groupName" ? "text" : "number"}
                  name={field.name === "groupName" ? undefined : field.name}
                  value={field.value}
                  onChange={field.name === "groupName" ? (e) => setGroupName(e.target.value) : handleInputChange}
                  className="w-40 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.name === "groupName" ? "Nama Kelompok" : "0-100"}
                />
              </div>
            ))}
          </div>
          <button onClick={handleProcess} className="mt-8 bg-blue-600 text-white p-3 w-full rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-md">
            Proses
          </button>
        </div>

        {/* Hasil Section */}
        <div className="bg-gray-200 p-6 rounded-lg w-full lg:w-1/2 shadow-md flex flex-col h-full">
          <h2 className="text-center text-xl font-semibold mb-6 text-gray-800">Hasil</h2>
          <div className="bg-white p-4 rounded-md flex-grow">
            {hasil.length === 0 ? (
              <p className="text-center text-base text-gray-500 py-10">Data hasil akan muncul di sini setelah diproses.</p>
            ) : (
              <table className="w-full table-auto text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-blue-100 text-gray-700">
                    <th className="p-2 border border-gray-300">Nama</th>
                    <th className="p-2 border border-gray-300">Pakar</th>
                    <th className="p-2 border border-gray-300">Sistem</th>
                    <th className="p-2 border border-gray-300">Rank Pakar</th>
                    <th className="p-2 border border-gray-300">Rank Sistem</th>
                    <th className="p-2 border border-gray-300">di</th>
                    <th className="p-2 border border-gray-300">di²</th>
                  </tr>
                </thead>
                <tbody>
                  {hasil.map((item, index) => (
                    <tr key={index} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                      <td className="p-2 border border-gray-300">{item.nama}</td>
                      <td className="p-2 border border-gray-300">{item.pakar}</td>
                      <td className="p-2 border border-gray-300">{item.sistem}</td>
                      <td className="p-2 border border-gray-300">{item.rankPakar}</td>
                      <td className="p-2 border border-gray-300">{item.rankSistem}</td>
                      <td className="p-2 border border-gray-300">{item.di}</td>
                      <td className="p-2 border border-gray-300">{item.di2}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-yellow-100 text-gray-800">
                    <td colSpan={6} className="p-2 border border-gray-300 text-center">
                      ∑di²
                    </td>
                    <td className="p-2 border border-gray-300">{hasil.reduce((acc, cur) => acc + (cur.di2 ?? 0), 0)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            {/* Tampilkan koefisien Spearman jika ada */}
            {spearman !== null && (
              <div className="mt-4 text-center text-lg text-gray-700">
                <strong>Koefisien Spearman:</strong> {spearman.toFixed(4)}
              </div>
            )}
          </div>
          {hasil.length > 0 && (
            <button onClick={handleReset} className="mt-6 bg-red-600 text-white p-3 w-full rounded-md hover:bg-red-700 transition duration-300 ease-in-out shadow-md">
              Reset Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
