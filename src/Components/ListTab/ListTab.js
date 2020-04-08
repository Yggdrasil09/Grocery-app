import React,{Component} from 'react';
import { Row, Col, Tabs, Form, Button, Select, Alert, Table, Modal, Input, message, Typography, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import './ListTab.css';

const { TabPane } = Tabs;

const { Option } = Select;

const { Title, Paragraph } = Typography;

const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 12,
  },
};

class ListTab extends Component{
    
    constructor(){
        super();
        this.state = {
            mode:'top',
            data:[],
            kart:[],
            item:"",
            price:0,
            quantity:0,
            selected_quantity:0,
            table:[],
            jsonlist:[],
            visible:false,
            canteen_data:[],
            selected_canteen:"",
            selected_name:"",
            selected_feedback:"",
            itemId:"",
        };
        this.columns = [
            {
              title: 'Item',
              dataIndex: 'item',
              key: 'item',
              render: text => <b>{text}</b>,
            },
            {
              title: 'Quantity',
              dataIndex: 'quantity',
              key: 'quantity',
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
            },
            {
                title: 'Total Price',
                dataIndex: 'totalprice',
                key: 'totalprice',
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) =>
                  this.state.table.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                      <DeleteOutlined style={{ fontSize: '27px', color: 'red' , marginLeft:'10px'}} />
                    </Popconfirm>
                  ) : null,
            },
        ];
    };

    formRef = React.createRef();

    showModal = () => {
        if(this.state.table.length === 0)
        {
            message.error("Please enter items into the cart!",3)
        }
        else
        {
            this.setState({
                visible: true,
            });
        }
    };

    handleOk = e => {
        if(this.state.selected_canteen===""||this.state.selected_name.length===0)
        {
            message.error("Please enter all the details!",3)
        }
        else
        {
            let data = {
                Name:this.state.selected_name,
                Zone:this.state.selected_canteen,
                Order:this.state.jsonlist,
                Feedback:this.state.selected_feedback,
            }
            console.log(data);
            this.setState({
                visible: false,
            },()=>{
                fetch("http://localhost:5000/submit-order",{
                    method:"POST",
                    body: JSON.stringify(data),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    credentials: "same-origin"
                })
                .then(res=>{
                    window.location.reload();
                })
                .catch(err=>{
                    console.log(err);
                })
            });
        }
    };

    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };

    onItemChange = value => {
        this.setState({
            item:value,
        },()=>{
            console.log(this.state.item)
            for(let i in this.state.data)
            {
                for(let j in this.state.data[i])
                {
                    if(this.state.data[i][j]["Item Name"] === this.state.item)
                    {
                        this.setState({
                            price:this.state.data[i][j]["Price"],
                            quantity:this.state.data[i][j]["Tab"],
                            itemId:this.state.data[i][j]["Item Code"],
                        })
                    }
                }
            }
        })
    };

    onAmountChange = value => {
        this.setState({
            selected_quantity:value
        })
    };

    onFinish = values => {
        this.setState({
            kart:this.state.kart.concat([values])
        },()=>{
            console.log(this.state.kart)
            this.setState({
                table:this.state.table.concat([{
                    key:this.state.table.length+1,
                    item:this.state.item,
                    quantity:this.state.selected_quantity,
                    price:this.state.price,
                    totalprice:(this.state.price*this.state.selected_quantity).toFixed(2),
                }]),
                jsonlist:this.state.jsonlist.concat([{
                    item:this.state.item,
                    quantity:this.state.quantity,
                    price:this.state.price,
                    code:this.state.itemId,
                }])
            })
        })
    };

    onCanteenChange = value => {
        console.log(value)
        this.setState({
            selected_canteen:value
        })
    }

    onNameChange = value => {
        this.setState({
            selected_name:value.target.value
        })
    }

    onFeedbackChange = value => {
        this.setState({
            selected_feedback:value.target.value,
        })
    }

    cancel_order = e => {
        ;
    }

    onTabChange =  e => {
        this.setState({
            price:0,
            item:"",
            selected_quantity:0,
        });
    }

    handleDelete = key => {
        const dataSource = [...this.state.table];
        this.setState({
            table: dataSource.filter(item => item.key !== key) 
        });
    };

    componentWillMount(){
        fetch("http://localhost:5000/test",{
            method:"GET"
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            console.log(data);
            this.setState({
                data:data
            })
        })
        .catch(err=>{
            console.log(err);
        })
        fetch("http://localhost:5000/trial",{
            method:"GET"
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            console.log(data);
            this.setState({
                canteen_data:data
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    render(){
        const { mode } = this.state.mode;
        return(
            <div>
                <Row>
                    <Col xs={1} sm={2} md={1} lg={1} xl={1}/>
                    <Col xs={22} sm={20} md={22} lg={22} xl={22}>
                        <Title level={2}>NSC Canteen Online Delivery Service</Title>
                        <Title level={3}>Contact: +91-8082992508</Title>
                    </Col>
                    <Col xs={1} sm={2} md={1} lg={1} xl={1}/>
                </Row>
                <Row >
                    <Col xs={2} sm={2} md={2} lg={2} xl={1}/>
                    <Col xs={20} sm={20} md={20} lg={20} xl={22}>
                        <Tabs defaultActiveKey="1" tabPosition={mode} onChange={this.onTabChange} size='large'>
                            {Object.keys(this.state.data).map(i => (
                                <TabPane tab={`${i}`} key={i}>
                                    <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                                        <Form.Item name="Item" label="Select from list and enter the quantity" rules={[{required: true,},]}>
                                            <Select placeholder="Select a item" onChange={this.onItemChange} allowClear>
                                                {this.state.data[i].map(j => (
                                                    <Option value={j["Item Name"]} key={j["Item Name"]}>{j["Item Name"]}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Alert className="alert-mesg" message={"Price per unit : "+this.state.price+"/-"} type="info" />
                                        <Form.Item name="Quantity" label="Select the quantity" rules={[{required: true,},]}>
                                            <Select  placeholder="Select the quantity of item" onChange={this.onAmountChange} allowClear>
                                                {Object.keys(this.state.quantity).map(j => (
                                                    <Option value={this.state.quantity[j]} key={this.state.quantity[j]}>{this.state.quantity[j]}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item {...tailLayout}>
                                            <Button type="primary" htmlType="submit" >
                                                Submit
                                            </Button>
                                            <Button className="checkout_but" htmlType="button" onClick={this.showModal}>
                                                Check Out
                                            </Button>
                                            <Modal title="Confirm your Details to place Order" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                                                <Form layout={"vertical"} ref={this.formRef} name="control-ref" >
                                                    <Form.Item  {...null} name="Canteen" label="Please select your desired drop point and time" rules={[{required: true,},]}>
                                                        <Select placeholder="Select a time" onChange={this.onCanteenChange} allowClear>
                                                            {Object.keys(this.state.canteen_data).map(i => (
                                                                Object.keys(this.state.canteen_data[i]).map(j => (
                                                                    <Option value={i+"!"+this.state.canteen_data[i][j]} key={i+this.state.canteen_data[i][j]}>{i+" : "+this.state.canteen_data[i][j]}</Option>
                                                                ))
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item name="name"  label="Please enter your name" rules={[{required: true,},]}>
                                                        <Input onChange={this.onNameChange} placeholder="Enter your name"/>
                                                    </Form.Item>
                                                    <Form.Item name="feedback"  label="Please enter your feedback">
                                                        <TextArea onChange={this.onFeedbackChange} placeholder="Enter your feedback" rows={4} />
                                                    </Form.Item>
                                                </Form>
                                            </Modal>
                                        </Form.Item>
                                    </Form>
                                </TabPane>
                            ))}
                        </Tabs>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} xl={1}/>
                </Row>
                <Row style={{ marginTop:"20px"}}>
                    <Col xs={2} sm={2} md={4} lg={4} xl={4}/>
                    <Col xs={20} sm={20} md={16} lg={16} xl={16}>
                        <Table columns={this.columns} dataSource={this.state.table} pagination={{ pageSize: 4 }}/>
                    </Col>
                    <Col xs={2} sm={2} md={4} lg={4} xl={4}/>
                </Row>
                <Row>
                    <Col xs={2} sm={2} md={2} lg={2} xl={2}/>
                    <Col xs={20} sm={20} md={20} lg={20} xl={20}>
                        <Paragraph>
                            NSC is commencing home area delivery of CSD items in a few officers accommodation where there is no other CSD counter nearby. The item list has been kept to essentials. The same will be revised regularly as per availability of stock and suggestions from dependents. Feel free to call the officer incharge at +91-8082992508
                        </Paragraph>
                        <Paragraph>
                            The orders placed will be delivered the next day as per times displayed. 3 ₹ will be charged over and above the billing amount for packing material. Please give the exact amount to the delivery boy. This will avoid crowding and avoidable delays in the process.
                        </Paragraph>
                        <Paragraph>
                            Stay In : Stay Safe !!!
                        </Paragraph>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} xl={2}/>
                </Row>
            </div>
        );
    }
}

export default ListTab;