import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Save, RefreshCw } from 'lucide-react';

const initialData = [
  {ماه: 1, درآمد: 19800000, هزینه_کل: 240000000, کاربران: 100, هزینه_API: 90000000, هزینه_پرسنل: 80000000, هزینه_مارکتینگ: 50000000, هزینه_زیرساخت: 20000000},
  {ماه: 2, درآمد: 19800000, هزینه_کل: 240000000, کاربران: 100, هزینه_API: 90000000, هزینه_پرسنل: 80000000, هزینه_مارکتینگ: 50000000, هزینه_زیرساخت: 20000000},
  {ماه: 3, درآمد: 19800000, هزینه_کل: 240000000, کاربران: 100, هزینه_API: 90000000, هزینه_پرسنل: 80000000, هزینه_مارکتینگ: 50000000, هزینه_زیرساخت: 20000000},
  {ماه: 4, درآمد: 99000000, هزینه_کل: 240000000, کاربران: 500, هزینه_API: 90000000, هزینه_پرسنل: 80000000, هزینه_مارکتینگ: 50000000, هزینه_زیرساخت: 20000000},
  {ماه: 5, درآمد: 99000000, هزینه_کل: 240000000, کاربران: 500, هزینه_API: 90000000, هزینه_پرسنل: 80000000, هزینه_مارکتینگ: 50000000, هزینه_زیرساخت: 20000000},
  {ماه: 6, درآمد: 99000000, هزینه_کل: 240000000, کاربران: 500, هزینه_API: 90000000, هزینه_پرسنل: 80000000, هزینه_مارکتینگ: 50000000, هزینه_زیرساخت: 20000000},
  {ماه: 7, درآمد: 396000000, هزینه_کل: 690000000, کاربران: 2000, هزینه_API: 90000000, هزینه_پرسنل: 390000000, هزینه_مارکتینگ: 100000000, هزینه_زیرساخت: 40000000},
  {ماه: 8, درآمد: 396000000, هزینه_کل: 690000000, کاربران: 2000, هزینه_API: 90000000, هزینه_پرسنل: 390000000, هزینه_مارکتینگ: 100000000, هزینه_زیرساخت: 40000000},
  {ماه: 9, درآمد: 396000000, هزینه_کل: 690000000, کاربران: 2000, هزینه_API: 90000000, هزینه_پرسنل: 390000000, هزینه_مارکتینگ: 100000000, هزینه_زیرساخت: 40000000},
  {ماه: 10, درآمد: 990000000, هزینه_کل: 690000000, کاربران: 5000, هزینه_API: 90000000, هزینه_پرسنل: 390000000, هزینه_مارکتینگ: 100000000, هزینه_زیرساخت: 40000000},
  {ماه: 11, درآمد: 990000000, هزینه_کل: 690000000, کاربران: 5000, هزینه_API: 90000000, هزینه_پرسنل: 390000000, هزینه_مارکتینگ: 100000000, هزینه_زیرساخت: 40000000},
  {ماه: 12, درآمد: 990000000, هزینه_کل: 690000000, کاربران: 5000, هزینه_API: 90000000, هزینه_پرسنل: 390000000, هزینه_مارکتینگ: 100000000, هزینه_زیرساخت: 40000000}
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MetricsDashboard = () => {
  const [data, setData] = useState(initialData);
  const [columns, setColumns] = useState(Object.keys(initialData[0]));
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fa-IR').format(number / 1000000) + ' میلیون تومان';
  };

  const handleCellChange = (rowIndex, columnName, value) => {
    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnName]: columnName === 'ماه' ? parseInt(value) : parseFloat(value)
    };
    setData(newData);
  };

  const addColumn = () => {
    if (newColumnName && !columns.includes(newColumnName)) {
      setColumns([...columns, newColumnName]);
      setData(data.map(row => ({ ...row, [newColumnName]: 0 })));
      setNewColumnName('');
      setShowAddColumn(false);
    }
  };
  const calculateMetrics = (data) => {
    let cumulativeBurn = 0;
    let maxBurn = 0;
    
    const processedData = data.map((row, index) => {
      // Calculate base metrics
      const cashFlow = row.درآمد - row.هزینه_کل;
      cumulativeBurn += cashFlow;
      maxBurn = Math.min(maxBurn, cumulativeBurn);
      
      // Calculate CAC
      const marketingCosts = row.هزینه_مارکتینگ;
      const newUsers = index > 0 ? row.کاربران - data[index - 1].کاربران : row.کاربران;
      const cac = newUsers > 0 ? marketingCosts / newUsers : 0;
      
      // Calculate burn rate
      const monthlyBurnRate = row.هزینه_کل - row.درآمد;
      
      return {
        ...row,
        جریان_نقدی: cashFlow,
        جریان_نقدی_تجمعی: cumulativeBurn,
        هزینه_جذب_مشتری: cac,
        نرخ_سوخت_سرمایه: monthlyBurnRate,
        هزینه_ثابت: row.هزینه_پرسنل + row.هزینه_زیرساخت
      };
    });
    
    return {
      processedData,
      maxBurn: Math.abs(maxBurn),
      averageCac: processedData.reduce((sum, row) => sum + row.هزینه_جذب_مشتری, 0) / processedData.length,
      averageBurnRate: processedData.reduce((sum, row) => sum + row.نرخ_سوخت_سرمایه, 0) / processedData.length
    };
  };
  // Calculate cost breakdown for pie chart
  const latestMonth = data[data.length - 1];
  const costBreakdown = [
    { name: 'هزینه پرسنل', value: latestMonth.هزینه_پرسنل },
    { name: 'هزینه API', value: latestMonth.هزینه_API },
    { name: 'هزینه مارکتینگ', value: latestMonth.هزینه_مارکتینگ },
    { name: 'هزینه زیرساخت', value: latestMonth.هزینه_زیرساخت },
  ];
  const { processedData, maxBurn, averageCac, averageBurnRate } = calculateMetrics(data);
  const breakEvenPoint = processedData.findIndex(row => row.درآمد >= row.هزینه_کل) + 1;
  const requiredInvestment = Math.ceil(maxBurn * 1.2); // 20% buffer
  const runwayMonths = Math.ceil(requiredInvestment / averageBurnRate);

  // Add Investment Metrics Card
  const InvestmentMetricsCard = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>تحلیل سرمایه‌گذاری</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">سرمایه مورد نیاز</div>
            <div className="text-xl font-bold text-blue-600">
              {formatNumber(requiredInvestment)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">متوسط هزینه جذب مشتری</div>
            <div className="text-xl font-bold text-green-600">
              {formatNumber(averageCac)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">متوسط نرخ سوخت سرمایه ماهانه</div>
            <div className="text-xl font-bold text-red-600">
              {formatNumber(averageBurnRate)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">مدت زمان دوام سرمایه</div>
            <div className="text-xl font-bold text-purple-600">
              {runwayMonths} ماه
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Add Burn Rate Chart
  const BurnRateChart = () => (
    <Card>
      <CardHeader>
        <CardTitle>نرخ سوخت سرمایه</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ماه" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={formatNumber} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="نرخ_سوخت_سرمایه" 
                name="نرخ سوخت سرمایه" 
                stroke="#ef4444" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  // Add CAC Chart
  const CacChart = () => (
    <Card>
      <CardHeader>
        <CardTitle>هزینه جذب مشتری</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ماه" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={formatNumber} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="هزینه_جذب_مشتری" 
                name="هزینه جذب مشتری" 
                stroke="#22c55e" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8" dir="rtl">
      
      <InvestmentMetricsCard />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>نقطه سر به سر: ماه {breakEvenPoint}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddColumn(true)}>
              <Plus className="w-4 h-4 ml-1" /> افزودن ستون
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 ml-1" /> ذخیره
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddColumn && (
            <div className="mb-4 flex space-x-2">
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="border p-2 rounded"
                placeholder="نام ستون جدید"
              />
              <Button onClick={addColumn}>افزودن</Button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column} className="border p-2 bg-gray-100">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map(column => (
                      <td key={column} className="border p-2">
                        <input
                          type="number"
                          value={row[column]}
                          onChange={(e) => handleCellChange(rowIndex, column, e.target.value)}
                          className="w-full p-1 text-left"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>درآمد و هزینه‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ماه" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={formatNumber} />
                  <Legend />
                  <Line type="monotone" dataKey="درآمد" name="درآمد" stroke="#4ade80" strokeWidth={2} />
                  <Line type="monotone" dataKey="هزینه_کل" name="هزینه کل" stroke="#f87171" strokeWidth={2} />
                  <Line type="monotone" dataKey="هزینه_ثابت" name="هزینه ثابت" stroke="#a855f7" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزیع هزینه‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatNumber} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>رشد کاربران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ماه" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="کاربران" name="تعداد کاربران" fill="#60a5fa" stroke="#2563eb" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>جریان نقدی تجمعی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ماه" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={formatNumber} />
                  <Line type="monotone" dataKey="جریان_نقدی_تجمعی" name="جریان نقدی تجمعی" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BurnRateChart />
        <CacChart />
      </div>
    </div>
  );
};

export default MetricsDashboard;