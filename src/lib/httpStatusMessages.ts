export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Preencha todos os campos obrigatórios corretamente.',
  401: 'Você não possui autorização para realizar esta operação.',
  403: 'Você não possui permissão para acessar este recurso.',
  404: 'O recurso solicitado não foi encontrado.',
  409: 'Já existe um recurso cadastrado com essas informações.',
  422: 'Não foi possível concluir a operação devido às regras de negócio.',
  429: 'Muitas requisições realizadas. Aguarde alguns instantes e tente novamente.',
  500: 'Ocorreu um erro interno. Tente novamente em alguns instantes.',
  502: 'O serviço está temporariamente indisponível. Tente novamente em alguns instantes.',
  503: 'O serviço está temporariamente indisponível. Tente novamente em alguns instantes.',
  504: 'O serviço está temporariamente indisponível. Tente novamente em alguns instantes.',
}

export const DEFAULT_ERROR_MESSAGE = 'Ocorreu um erro interno. Tente novamente em alguns instantes.'

export const NETWORK_ERROR_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.'

export const TIMEOUT_ERROR_MESSAGE = 'A operação demorou mais do que o esperado. Tente novamente.'
