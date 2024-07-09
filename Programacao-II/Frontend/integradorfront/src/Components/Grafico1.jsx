import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

function Grafico1(params) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3301/Grafico1", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        const data = response.data;

        const chartDataFormatted = [["Data Added", "Number of Animals"]];
        data.forEach((item) => {
            const formatData = item.data_added.split('T')[0];
          chartDataFormatted.push([formatData, parseInt(item.num_animal)]);
        });

        setChartData(chartDataFormatted);
      } catch (error) {
        console.log("An error has ocurred:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex px-4 py-4 font-semibold text-xs max-w-full">
      <Chart
        width={"100%"}
        height={"400px"}
        chartType="ColumnChart"
        loader={<div>Carregando gráfico...</div>}
        data={chartData}
        options={{
          title: "Número de Animais por Data",
          chartArea: { width: "70%" },
          hAxis: {
            title: "Data de adicao",
            minValue: 0,
          },
          vAxis: {
            title: "Número de Animais",
          },
        }}
      />
    </div>
  );
}

export default Grafico1;
