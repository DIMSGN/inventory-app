import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Select, Table, InputNumber, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { invoiceService, supplierService, productService } from '../mockServices';
import dayjs from 'dayjs';
import { DatePickerField, Icon } from '../../../../../common/components';
import styles from '../../../styles/InvoiceForm.module.css';

const { Option } = Select;

const InvoiceForm = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceDate, setInvoiceDate] = useState(dayjs().format('YYYY-MM-DD'));

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Failed to load suppliers');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to load products');
    }
  };

  const handleItemChange = (value, field, index) => {
    const newItems = [...items];

    if (!newItems[index]) {
      newItems[index] = {};
    }

    newItems[index][field] = value;

    if (field === 'product_id') {
      const product = products.find(p => p.product_id === value);
      if (product) {
        newItems[index].unit_price = product.purchase_price || 0;
        newItems[index].product_name = product.product_name;
      }
    }

    setItems(newItems);
  };

  const calculateTotal = useCallback(() => {
    const total = items.reduce((sum, item) => {
      return sum + ((item.quantity || 0) * (item.unit_price || 0));
    }, 0);

    setTotalAmount(total);
  }, [items]);

  const addItem = () => {
    setItems([...items, {}]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const data = {
        supplier_id: values.supplier_id,
        invoice_date: invoiceDate,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      };

      setLoading(true);
      await invoiceService.createInvoice(data);
      setLoading(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setLoading(false);
      console.error('Error saving invoice:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to save invoice');
      }
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [items, calculateTotal]);

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product_id',
      key: 'product_id',
      render: (text, record, index) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Select product"
          value={text}
          onChange={(value) => handleItemChange(value, 'product_id', index)}
          required
        >
          {products.map(product => (
            <Option key={product.product_id} value={product.product_id}>
              {product.product_name}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record, index) => (
        <InputNumber
          min={0.01}
          step={0.01}
          style={{ width: '100%' }}
          placeholder="Quantity"
          value={text}
          onChange={(value) => handleItemChange(value, 'quantity', index)}
          required
        />
      )
    },
    {
      title: 'Unit Price ($)',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (text, record, index) => (
        <InputNumber
          min={0.01}
          step={0.01}
          style={{ width: '100%' }}
          placeholder="Price"
          value={text}
          onChange={(value) => handleItemChange(value, 'unit_price', index)}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          required
        />
      )
    },
    {
      title: 'Total',
      key: 'total',
      render: (text, record) => {
        const total = (record.quantity || 0) * (record.unit_price || 0);
        return `$${total.toFixed(2)}`;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(index)}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        supplier_id: undefined
      }}
    >
      <Form.Item label="Supplier" name="supplier_id" rules={[{ required: true, message: 'Please select a supplier' }]}>
        <Select placeholder="Select a supplier">
          {suppliers.map(supplier => (
            <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Invoice Date" required>
        <DatePickerField
          selected={invoiceDate ? new Date(invoiceDate) : new Date()}
          onChange={(date) => {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            setInvoiceDate(formattedDate);
          }}
          dateFormat="yyyy-MM-dd"
          className={styles.datePicker}
        />
      </Form.Item>

      <div style={{ marginBottom: 16 }}>
        <h3>Invoice Items</h3>
        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => index}
          size="small"
          locale={{ emptyText: 'No items added yet' }}
        />

        <Button
          type="dashed"
          onClick={addItem}
          style={{ width: '100%', marginTop: 16 }}
          icon={<PlusOutlined />}
        >
          Add Item
        </Button>
      </div>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={items.length === 0} icon={<SaveOutlined />}>
          Save Invoice
        </Button>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InvoiceForm; 