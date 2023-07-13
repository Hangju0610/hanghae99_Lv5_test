const PostController = require('../../controllers/posts.controller');
const PostsController = require('../../controllers/posts.controller');

let mockPostService = {
  findAllPost: jest.fn(),
  findPost: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

let mockRequest = {
  body: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

let postsController = new PostsController();
// postsController의 Service를 Mock Service로 변경
postsController.postService = mockPostService;

describe('Layered Architecture Pattern Post Controller Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks();

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신:this)로 설정되어야 합니다.
    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test('Posts Controller getPosts 성공 test', async () => {
    const returnValue = [
      {
        postId: 1,
        userId: 1,
        nickname: 'test',
        title: 'test title',
        likes: 2,
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      },
      {
        postId: 2,
        userId: 2,
        nickname: 'test2',
        title: 'test2 title',
        likes: 4,
        createdAt: new Date('07 October 2011 15:50 UTC'),
        updatedAt: new Date('07 October 2011 15:50 UTC'),
      },
    ];

    mockPostService.findAllPost = jest.fn(() => returnValue);

    // PostsController의 getPosts metodh를 실행
    await postsController.getPosts(mockRequest, mockResponse);

    // 1. PostsService의 findAllPost Method를 1회 호출한다.
    expect(mockPostService.findAllPost).toHaveBeenCalledTimes(1);

    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. 반한된 posts의 변수를 res.json을 이용하여 내보내기
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: returnValue,
    });
  });

  test('Posts Controller getPost 성공 test', async () => {
    // Params 인자
    const requestParams = {
      postId: 1,
    };
    //Mock에 Params 인자 주입
    mockRequest.params = requestParams;

    // returnValue 투입
    const returnValue = {
      postId: 1,
      userId: 1,
      nickname: 'test',
      title: 'test title',
      content: 'test content',
      likes: 2,
      createdAt: new Date('06 October 2011 15:50 UTC'),
      updatedAt: new Date('06 October 2011 15:50 UTC'),
    };

    mockPostService.findPost = jest.fn(() => {
      return returnValue;
    });

    await postsController.getPost(mockRequest, mockResponse);

    expect(mockPostService.findPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.findPost).toHaveBeenCalledWith(requestParams.postId);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      data: returnValue,
    });
  });

  test('Posts Controller createPost 성공 test', async () => {
    const bodyParams = {
      title: 'test1',
      content: 'test1 content',
    };
    const locals = {
      user: {
        userId: 1,
      },
    };

    mockRequest.body = bodyParams;
    mockResponse.locals = locals;

    const returnValue = {
      postId: 1,
      userId: 1,
      nickname: 'test',
      title: 'test1',
      content: 'test1 content',
      likes: 0,
      createdAt: new Date('06 October 2011 15:50 UTC'),
      updatedAt: new Date('06 October 2011 15:50 UTC'),
    };

    mockPostService.createPost = jest.fn(() => {
      return returnValue;
    });

    await postsController.createPost(mockRequest, mockResponse);

    expect(mockPostService.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.createPost).toHaveBeenCalledWith(
      locals.user.userId,
      bodyParams.title,
      bodyParams.content
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    expect(mockResponse.json).toHaveBeenCalledWith({
      createPostData: returnValue,
    });
  });

  test('Posts Controller createPost Params 가 없는 경우 test', async () => {
    const failedBodyParams = {
      content: 'failed test',
    };

    const locals = {
      user: {
        userId: 1,
      },
    };

    mockRequest.body = failedBodyParams;
    mockResponse.locals = locals;

    await postsController.createPost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(412);

    expect(mockResponse.json).toHaveBeenCalledWith({
      errorMessage: '데이터 형식이 올바르지 않습니다.',
    });
  });

  test('Posts Controller createPost Params에 공백이 있는 경우 test', async () => {
    const failedBodyParams = {
      title: 'failed test',
      content: '',
    };

    const locals = {
      user: {
        userId: 1,
      },
    };

    mockRequest.body = failedBodyParams;
    mockResponse.locals = locals;

    await postsController.createPost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(412);

    expect(mockResponse.json).toHaveBeenCalledWith({
      errorMessage: '내용을 입력해주세요.',
    });
  });

  test('Posts Controller updatePost 성공 test', async () => {
    const locals = {
      user: {
        userId: 1,
      },
    };

    const urlParams = {
      postId: 1,
    };

    const bodyParams = {
      title: 'test1',
      content: 'test1 content',
    };

    const returnValue = {
      success: true,
    };

    mockRequest.body = bodyParams;
    mockRequest.params = urlParams;
    mockResponse.locals = locals;

    mockPostService.updatePost = jest.fn(() => {
      return returnValue;
    });

    await postsController.updatePost(mockRequest, mockResponse);

    expect(mockPostService.updatePost).toHaveBeenCalledTimes(1);
    expect(mockPostService.updatePost).toHaveBeenCalledWith(
      urlParams.postId,
      locals.user.userId,
      bodyParams.title,
      bodyParams.content
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      updatePostData: returnValue,
    });
  });

  test('Posts Controller updatePost Params 가 없는 경우 test', async () => {
    const failedBodyParams = {
      content: 'failed test',
    };

    const urlParams = {
      postId: 1,
    };

    const locals = {
      user: {
        userId: 1,
      },
    };

    mockRequest.body = failedBodyParams;
    mockRequest.params = urlParams;
    mockResponse.locals = locals;

    await postsController.updatePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(412);

    expect(mockResponse.json).toHaveBeenCalledWith({
      errorMessage: '데이터 형식이 올바르지 않습니다.',
    });
  });

  test('Posts Controller updatePost Params에 공백이 있는 경우 test', async () => {
    const failedBodyParams = {
      title: 'failed test',
      content: '',
    };

    const urlParams = {
      postId: 1,
    };

    const locals = {
      user: {
        userId: 1,
      },
    };

    mockRequest.body = failedBodyParams;
    mockRequest.params = urlParams;
    mockResponse.locals = locals;

    await postsController.createPost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(412);

    expect(mockResponse.json).toHaveBeenCalledWith({
      errorMessage: '내용을 입력해주세요.',
    });
  });

  test('Posts Controller deletePost 성공 test', async () => {
    const urlParams = {
      postId: 1,
    };

    const locals = {
      user: {
        userId: 1,
      },
    };

    const returnValue = {
      success: true,
    };

    mockResponse.locals = locals;
    mockRequest.params = urlParams;

    mockPostService.deletePost = jest.fn(() => {
      return returnValue;
    });

    await postsController.deletePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      deletePostData: returnValue,
    });
  });
});
