import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import scheduleApi from '../../../api/scheduleApi';

const { TextArea } = Input;

const CreateScheduleModal = ({ visible, onCancel, onSuccess, flockId, schedule = null }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (visible) {
            if (schedule) {
                // Chế độ edit - điền dữ liệu hiện tại
                form.setFieldsValue({
                    flockId: schedule.flockId || flockId,
                    title: schedule.title,
                    description: schedule.description || '',
                    scheduledDate: schedule.scheduledDate ? dayjs(schedule.scheduledDate) : dayjs().add(1, 'day')
                });
            } else {
                // Chế độ tạo mới
                form.resetFields();
                form.setFieldsValue({
                    flockId: flockId,
                    scheduledDate: dayjs().add(1, 'day')
                });
            }
        }
    }, [visible, form, flockId, schedule]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const scheduleData = {
                flockId: values.flockId,
                title: values.title,
                description: values.description,
                scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
            };

            setLoading(true);

            if (schedule) {
                // Cập nhật schedule
                await scheduleApi.updateSchedule(schedule.id, scheduleData);
                message.success('Cập nhật lịch trình thành công');
            } else {
                // Tạo schedule mới
                await scheduleApi.createSchedule(scheduleData);
                message.success('Tạo lịch trình thành công');
            }

            form.resetFields();
            onSuccess();
            onCancel();
        } catch (error) {
            console.error('Error saving schedule:', error);
            message.error(error.response?.data?.message || 'Lỗi khi lưu lịch trình');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={schedule ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={schedule ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            confirmLoading={loading}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="title"
                    label="Tiêu đề công việc"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiêu đề' },
                        { max: 200, message: 'Tiêu đề không quá 200 ký tự' }
                    ]}
                >
                    <Input placeholder="VD: Tiêm vaccine Marek" />
                </Form.Item>

                <Form.Item
                    name="scheduledDate"
                    label="Ngày thực hiện"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                            // Không cho chọn ngày trong quá khứ
                            return current && current < dayjs().startOf('day');
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả chi tiết"
                >
                    <TextArea
                        rows={3}
                        placeholder="Nhập mô tả chi tiết công việc..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item name="flockId" hidden>
                    <Input type="hidden" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateScheduleModal;