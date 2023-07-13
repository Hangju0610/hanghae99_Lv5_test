// Post Service test code
const PostService = require('../../services/posts.service');

// mock Post 저장소 추가
let mockPostsRepository = {
  findAllPost: jest.fn(),
  findPostByPostId: jest.fn(),
  findPostOrderLike: jest.fn(),
  validatePostByUserId: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

let postService = new PostService();

// postService의 Repository를 mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository;

describe('계층 아키텍처 패턴 Posts 서비스 유닛 Test', () => {
  // 각 test가 실행되기 전에 실행
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Posts Service findAllPosts test', async () => {
    // Method 실행 했을 때 Return 받아야할 값
    // 이런거를 외부 모듈로 빼면?
    const returnValue = [
      {
        postId: 1,
        userId: 1,
        'User.nickname': 'test',
        title: 'test title',
        likes: 2,
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      },
      {
        postId: 2,
        userId: 2,
        'User.nickname': 'test2',
        title: 'test2 title',
        likes: 4,
        createdAt: new Date('07 October 2011 15:50 UTC'),
        updatedAt: new Date('07 October 2011 15:50 UTC'),
      },
    ];

    // Repository의 findAllPost Method를 Mocking하고, Retrun 값 변경
    mockPostsRepository.findAllPost = jest.fn(() => {
      return returnValue;
    });

    // PostService method 호출
    const allPost = await postService.findAllPost();

    // 실제 Return값과 같은지 검증
    expect(allPost).toEqual([
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
    ]);
    // PostRepository의 findAllPost 메서드의 호출 횟수 확인
    expect(mockPostsRepository.findAllPost).toHaveBeenCalledTimes(1);
  });

  test('Posts Service findPost 성공 test', async () => {
    // Method 실행 했을 때 Return 받아야할 값
    const returnValue = {
      postId: 1,
      userId: 1,
      'User.nickname': 'test',
      title: 'test title',
      content: 'testtest',
      likes: 2,
      createdAt: new Date('06 October 2011 15:50 UTC'),
      updatedAt: new Date('06 October 2011 15:50 UTC'),
    };

    // Repository의 findPostByPostId Method Mocking하기
    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return returnValue;
    });

    // PostService method 호출
    const post = await postService.findPost(returnValue.postId);

    // 비즈니스 로직 작성

    // 1. findPostByPostId를 사용하여 post 찾기
    expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(
      returnValue.postId
    );
    // 2. post를 return 한다.
    expect(post).toEqual({
      postId: returnValue.postId,
      userId: returnValue.userId,
      nickname: returnValue['User.nickname'],
      title: returnValue.title,
      content: returnValue.content,
      likes: returnValue.likes,
      createdAt: returnValue.createdAt,
      updatedAt: returnValue.updatedAt,
    });
  });

  test('Posts Service findPost Post를 못찾을 경우 test', async () => {
    const returnValue = null;

    const postId = 2;

    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return returnValue;
    });

    try {
      const post = await postService.findPost(postId);
    } catch (error) {
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(postId);

      expect(error.message).toEqual('게시글이 존재하지 않습니다.');
      expect(error.status).toEqual(404);
    }
  });

  test('Posts Service createPost 성공 test', async () => {
    const returnValue = {
      success: true,
    };

    const createPost = await postService.createPost(1, 'test', 'test content');

    expect(mockPostsRepository.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.createPost).toHaveBeenCalledWith(
      1,
      'test',
      'test content'
    );

    expect(createPost).toEqual(returnValue);
  });

  test('Posts Service updatePost test 성공 test', async () => {
    const returnValue = {
      success: true,
    };

    const params = {
      postId: 1,
      userId: 1,
      title: 'update title',
      content: 'update content',
    };

    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return {
        postId: 1,
        userId: 1,
        'User.nickname': 'test',
        title: 'test title',
        content: 'testtest',
        likes: 2,
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      };
    });
    mockPostsRepository.validatePostByUserId = jest.fn(() => {
      return {
        postId: 1,
        userId: 1,
      };
    });

    const updateData = await postService.updatePost(
      params.postId,
      params.userId,
      params.title,
      params.content
    );

    // 1. 게시글 확인
    expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(
      params.postId
    );

    // 2. 편집 권한 확인
    expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledWith(
      params.postId,
      params.userId
    );

    // 3. updatePost 확인
    expect(mockPostsRepository.updatePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.updatePost).toHaveBeenCalledWith(
      params.postId,
      params.title,
      params.content
    );
    // 4. 해당 Method의 Return 값이 내가 원하는 형태인지 확인한다.
    expect(updateData).toEqual(returnValue);
  });

  test('Posts Service updatePost 게시글 없는 경우 Fail test', async () => {
    const params = {
      postId: 10,
      userId: 1,
      title: 'update title',
      content: 'update content',
    };

    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return null;
    });

    try {
      const updateData = await postService.updatePost(
        params.postId,
        params.userId,
        params.title,
        params.content
      );
    } catch (error) {
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(
        params.postId
      );

      expect(error.message).toEqual('게시글이 존재하지 않습니다.');
      expect(error.status).toEqual(404);
    }
  });

  test('Posts Service updatePost 편집 권한 없는 경우 Fail test', async () => {
    const params = {
      postId: 10,
      userId: 1,
      title: 'update title',
      content: 'update content',
    };

    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return {
        postId: 10,
        userId: 1,
        'User.nickname': 'test',
        title: 'test title',
        content: 'testtest',
        likes: 2,
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      };
    });

    mockPostsRepository.validatePostByUserId = jest.fn(() => {
      return null;
    });

    try {
      const updateData = await postService.updatePost(
        params.postId,
        params.userId,
        params.title,
        params.content
      );
    } catch (error) {
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(
        params.postId
      );

      expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledWith(
        params.postId,
        params.userId
      );

      expect(error.message).toEqual('게시글의 편집 권한이 없습니다.');
      expect(error.status).toEqual(403);
    }
  });

  test('Posts Service deletePost test 성공 test', async () => {
    const returnValue = {
      success: true,
    };

    const params = {
      postId: 1,
      userId: 1,
    };

    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return {
        postId: 1,
        userId: 1,
        'User.nickname': 'test',
        title: 'test title',
        content: 'testtest',
        likes: 2,
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      };
    });
    mockPostsRepository.validatePostByUserId = jest.fn(() => {
      return {
        postId: 1,
        userId: 1,
      };
    });

    const deleteData = await postService.deletePost(
      params.postId,
      params.userId
    );

    // 1. 게시글 확인
    expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(
      params.postId
    );

    // 2. 편집 권한 확인
    expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledWith(
      params.postId,
      params.userId
    );

    // 3. deletePost 확인
    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(
      params.postId,
      params.userId
    );
    // 4. 해당 Method의 Return 값이 내가 원하는 형태인지 확인한다.
    expect(deleteData).toEqual(returnValue);
  });

  test('Posts Service deletePost 게시글 없는 경우 Fail test', async () => {
    const params = {
      postId: 10,
      userId: 1,
    };

    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return null;
    });

    try {
      const deleteData = await postService.deletePost(
        params.postId,
        params.userId
      );
    } catch (error) {
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(
        params.postId
      );

      expect(error.message).toEqual('게시글이 존재하지 않습니다.');
      expect(error.status).toEqual(404);
    }
  });

  test('Posts Service deletePost 삭제 권한 없는 경우 Fail test', async () => {
    const params = {
      postId: 10,
      userId: 1,
    };

    mockPostsRepository.findPostByPostId = jest.fn(() => {
      return {
        postId: 10,
        userId: 1,
        'User.nickname': 'test',
        title: 'test title',
        content: 'testtest',
        likes: 2,
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      };
    });

    mockPostsRepository.validatePostByUserId = jest.fn(() => {
      return null;
    });

    try {
      const deleteData = await postService.deletePost(
        params.postId,
        params.userId
      );
    } catch (error) {
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostByPostId).toHaveBeenCalledWith(
        params.postId
      );

      expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.validatePostByUserId).toHaveBeenCalledWith(
        params.postId,
        params.userId
      );

      expect(error.message).toEqual('게시글의 삭제 권한이 없습니다.');
      expect(error.status).toEqual(403);
    }
  });
});
