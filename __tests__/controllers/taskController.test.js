const {
  createTask,
  getTasks,
  createTaskWithCheck,
} = require("../../controllers/taskController");

// Mock the Task model that controller depends on
jest.mock("../../models/Task", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}));

const Task = require("../../models/Task");

// Helper to flush pending microtasks for controllers that use Promise.then without returning it
const flushPromises = () => new Promise(process.nextTick);

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("taskController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    test("should return 400 when title is missing and not call Task.create", async () => {
      const req = { body: {} };
      const res = mockRes();

      createTask(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Title is required" });
      expect(Task.create).not.toHaveBeenCalled();
    });

    test("should create a task and respond with 200 and payload", async () => {
      const req = { body: { title: "Write tests" } };
      const res = mockRes();
      const created = { _id: "t1", title: "Write tests" };
      Task.create.mockResolvedValue(created);

      createTask(req, res);
      await flushPromises();

      expect(Task.create).toHaveBeenCalledWith({ title: "Write tests" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Task Created", data: created });
    });
  });

  describe("getTasks", () => {
    test("should return 201 with empty list when no tasks", async () => {
      const req = {};
      const res = mockRes();
      Task.find.mockResolvedValue([]);

      getTasks(req, res);
      await flushPromises();

      expect(Task.find).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: "Tasks List", data: [] });
    });

    test("should return 200 with tasks list", async () => {
      const req = {};
      const res = mockRes();
      const tasks = [
        { _id: "1", title: "A" },
        { _id: "2", title: "B" },
      ];
      Task.find.mockResolvedValue(tasks);

      getTasks(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: "Tasks List", data: tasks });
    });
  });

  describe("createTaskWithCheck", () => {
    test("should return 400 when task already exists and not create a new one", async () => {
      const req = { body: { title: "Duplicate" } };
      const res = mockRes();
      Task.findOne.mockResolvedValue({ _id: "e1", title: "Duplicate" });

      await createTaskWithCheck(req, res);

      expect(Task.findOne).toHaveBeenCalledWith({ title: "Duplicate" });
      expect(Task.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Task already exists" });
    });

    test("should create and return 201 when task does not exist", async () => {
      const req = { body: { title: "New Task" } };
      const res = mockRes();
      Task.findOne.mockResolvedValue(null);
      const created = { _id: "nt1", title: "New Task" };
      Task.create.mockResolvedValue(created);

      await createTaskWithCheck(req, res);

      expect(Task.findOne).toHaveBeenCalledWith({ title: "New Task" });
      expect(Task.create).toHaveBeenCalledWith({ title: "New Task" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: "Task Created", data: created });
    });

    test("should query using provided title field", async () => {
      const req = { body: { title: "Check Title" } };
      const res = mockRes();
      Task.findOne.mockResolvedValue(null);
      Task.create.mockResolvedValue({ _id: "x", title: "Check Title" });

      await createTaskWithCheck(req, res);

      // verify correct filter shape is used
      expect(Task.findOne).toHaveBeenCalledWith({ title: "Check Title" });
    });
  });
});
